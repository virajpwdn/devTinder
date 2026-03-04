const { Router } = require("express");
const requestRouter = Router();
const { authenticate } = require("../middlewares/auth");
const requestController = require("../controllers/request.controller");

requestRouter.post(
  "/request/send/:status/:userId",
  authenticate,
  requestController.requestSendController,
);

requestRouter.post(
  "/request/review/:status/:userId",
  authenticate,
  requestController.requestReviewController,
);

module.exports = requestRouter;
