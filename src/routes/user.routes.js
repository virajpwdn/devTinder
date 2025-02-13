const { Router } = require("express");
const userRouter = Router();
const { authenticate } = require("../middlewares/auth");
const connectionRequest = require("../models/connectionRequestion");

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
