const { Router } = require("express");
const userRouter = Router();
const { authenticate } = require("../middlewares/auth");
const connectionRequest = require("../models/connectionRequestion");

userRouter.get("/user/requests/received", authenticate, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const receivedRequests = await connectionRequest.find({
      _id: loggedInUser._id,
      status: "interested",
    });

    if (!receivedRequests) {
      return res.status(201).json({ message: "you have no pending requests" });
    }

    res
      .status(200)
      .json({
        message: `You have received ${receivedRequests.length} requests`,
        receivedRequests,
      });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = userRouter;
