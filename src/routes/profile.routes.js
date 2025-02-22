const { Router } = require("express");
const profileRouter = Router();
const { authenticate } = require("../middlewares/auth");
const User = require("../models/user");
const { validateEditProfileData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const validator = require('validator');

profileRouter.get("/profile/view", authenticate, async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({message : user, status:`${user.firstName}, you are logged in`,});
  } catch (error) {
    throw new Error("ERROR " + error.message);
  }
});

profileRouter.patch("/profile/edit", authenticate, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) throw new Error("Invalid Edit Request");

    const oldData = req.user;
    const newData = req.body;

    Object.keys(newData).forEach((key) => (oldData[key] = newData[key]));

    await oldData.save();

    res.json({
      message: `${oldData.firstName}, your profile is updated successfully`,
      data: oldData,
    });
    // res.send(`${oldData.firstName}, your profile is updated successfully`);
  } catch (error) {
    res.status(400).json("ERROR: " + error.message);
  }
});

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
  async (req, res) => {
    try {
      // const { email } = req.body;
      const user = req.user;
      const { password, confirmpassword } = req.body;
      if (password !== confirmpassword)
        throw new Error("Password not matched");

      if(!validator.isStrongPassword(password)) throw new Error("Enter a Strong Password");
      const hashPassword = await bcrypt.hash(password, 10)
      user.password = hashPassword;
      await user.save();
      res.status(200).json({message: "data successfully updated"});
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

module.exports = profileRouter;
