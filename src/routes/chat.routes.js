const { Router } = require("express");
const { authenticate } = require("../middlewares/auth");
const Chat = require("../models/chat");
const chatRouter = Router();

chatRouter.get("/getallchat/:targetId", authenticate, async (req, res) => {
  try {
    const { targetId } = req.params;
    if (!targetId) throw new Error("Target Id Missing");
    let chat = await Chat.findOne({
      participants: { $all: [req.user._id, targetId] },
    }).populate({ path: "messages.senderId", select: "firstName lastName" });

    // if (!chat) {
    //   res
    //     .status(200)
    //     .json({ message: "Starting new Conversation?", chat: null });
    // }

    // TODO: add seenStatus update it when user sees the message
    // chat.updateOne({
    //     _id: chat.messages._id
    // }, {set:{}})

    res.status(200).json({ chat });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = chatRouter;
