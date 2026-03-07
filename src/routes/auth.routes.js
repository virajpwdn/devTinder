const { Router } = require("express");
const authRouter = Router();
const controller = require("../controllers/auth.controller");
const { authenticate } = require("../middlewares/auth");

authRouter.post("/signup", controller.signUpController);

authRouter.post("/login", controller.loginController);

authRouter.post("/logout", controller.logoutController);

authRouter.get("/imagekit/auth", authenticate, controller.imageKitController);

module.exports = authRouter;
