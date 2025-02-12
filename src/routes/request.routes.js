const { Router } = require("express");
const requestRouter = Router();
const { authenticate } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequestion");
const user = require("../models/user");
const ConnectionRequestModel = require("../models/connectionRequestion");

requestRouter.post(
  "/request/send/:status/:userId",
  authenticate,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.userId;
      const status = req.params.status;

      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus.includes(status))
        throw new Error(`status invalid: ${status}`);

      const validateToUserId = await user.findById(toUserId);
      if (!validateToUserId) throw new Error(`Invalid user id: ${toUserId}`);

      const checkRequestExists = await ConnectionRequest.findOne({
        $or: [
          { fromUserId: fromUserId, toUserId: toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if(checkRequestExists) throw new Error(`Request is already sent`);

      const newConnection = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await newConnection.save();
      res.status(200).json({ message: "Your request is sent", data });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

module.exports = requestRouter;
