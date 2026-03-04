const { Router } = require("express");
const authRouter = Router();
const controller = require("../controllers/auth.controller");

authRouter.post("/signup", controller.signUpController);

authRouter.post("/login", controller.loginController);

authRouter.post("/logout", controller.logoutController);

module.exports = authRouter;
