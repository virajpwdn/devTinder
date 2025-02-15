const { Router } = require("express");
const userRouter = Router();
const { authenticate } = require("../middlewares/auth");
const connectionRequest = require("../models/connectionRequestion");
const user = require("../models/user");

const USER_SAFE_DATA = "firstName lastName gender bio age photo skills";

userRouter.get("/user/requests/received", authenticate, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const receivedRequests = await connectionRequest
      .find({
        toUserId: loggedInUser._id,
        status: "interested",
      })
      .populate("fromUserId", USER_SAFE_DATA);

    if (!receivedRequests) {
      return res.status(201).json({ message: "you have no pending requests" });
    }

    res.status(200).json({
      message: `You have received ${receivedRequests.length} requests`,
      receivedRequests,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

userRouter.get("/user/connections", authenticate, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const allConnections = await connectionRequest
      .find({
        $or: [
          { fromUserId: loggedInUser._id, status: "accepted" },
          { toUserId: loggedInUser._id, status: "accepted" },
        ],
      })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = allConnections.map((row) => {
      if (row.fromUserId._id.equals(loggedInUser._id)) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.status(200).json({
      message: `You have total ${allConnections.length} connections`,
      data,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = userRouter;

userRouter.get("/user/feed", authenticate, async (req, res) => {
  try {
    //* 1. Authenticate user, this page should be only visible to loggedIn user
    /** 2. photo, bio, firstName, gender, age, skills
     *  3. User should see his connections and can see users which are not his connection
     *  4. Client should not see his own data in feed page
     */

    // User should see all the user cards except
    // 0. his own card
    // 1. his connections
    // 2. ignored people
    // 3. already sent the connection request

    const loggedInUser = req.user;

    const findConnections = await connectionRequest
      .find({
        $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
      })
      .select("fromUserId toUserId");

    const hiddenUsers = new Set();
    findConnections.forEach((REQ) => {
      hiddenUsers.add(REQ.fromUserId);
      hiddenUsers.add(REQ.toUserId);
    });

    const showUser = await user
      .find({
        $and: [
          {_id: {$nin: Array.from(hiddenUsers)}},
          {_id: {$ne: loggedInUser._id}}
        ]
      }).select(USER_SAFE_DATA)

    res.send(showUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
