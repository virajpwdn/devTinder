const { Router } = require("express");
const profileRouter = Router();
const { authenticate } = require("../middlewares/auth");
const profileController = require("../controllers/profile.controller");

profileRouter.get(
  "/profile/view",
  authenticate,
  profileController.profileViewController,
);

profileRouter.patch(
  "/profile/edit",
  authenticate,
  profileController.profileEditController,
);

// profileRouter.patch("/profile/forgotpassword", async (req, res) => {
//   try {
//     const { password, confirmPassword } = req.body;
//     if (!password === confirmPassword)
//       throw new Error("Confirm Password does not match");
//     const user = req.user;
//     // user.password = password;
//     console.log(user);
//     res.send("Password Updated");
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

profileRouter.patch(
  "/profile/forgotpassword",
  authenticate,
  profileController.forgotPasswordController,
);

module.exports = profileRouter;
