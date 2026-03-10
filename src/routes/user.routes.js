const { Router } = require("express");
const userRouter = Router();
const { authenticate } = require("../middlewares/auth");
const userController = require("../controllers/user.controller");

userRouter.get(
  "/user/requests/received",
  authenticate,
  userController.userRequestReceivedController,
);

userRouter.get(
  "/user/connections",
  authenticate,
  userController.userConnectionController,
);

userRouter.get("/user/feed", authenticate, userController.feedController);

userRouter.post("/user/img/upload", authenticate, userController.imgUploadController);

module.exports = userRouter;
