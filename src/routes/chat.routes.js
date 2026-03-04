const { Router } = require("express");
const { authenticate } = require("../middlewares/auth");
const chatController = require("../controllers/chat.controller");

const chatRouter = Router();

chatRouter.get(
  "/getallchat/:targetId",
  authenticate,
  chatController.getAllChatController,
);

module.exports = chatRouter;
