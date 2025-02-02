const { Router } = require("express");
const profileRouter = Router();
const { authenticate } = require("../middlewares/auth");
const User = require("../models/user");
const { validateEditProfileData } = require("../utils/validation");
const bcrypt = require("bcrypt");

profileRouter.get("/profile", authenticate, async (req, res) => {
  try {
    const user = req.user;
    res.json(user.firstName + " logged in");
  } catch (error) {
    throw new Error("ERROR " + error.message);
  }
});

profileRouter.patch("/profile/edit", authenticate, async (req, res) => {
  try {
    // TODO: Add api level validation
    if (!validateEditProfileData(req)) throw new Error("Invalid Edit Request");

    const oldData = req.user;
    const newData = req.body;

    Object.keys(newData).forEach((key) => (oldData[key] = newData[key]));

    await oldData.save();

    res.json({ "message: ": "user updated", data: oldData });
  } catch (error) {
    res.status(400).json("ERROR: " + error.message);
  }
});

profileRouter.patch("/profile/forgotpassword", async (req, res) => {
  try {
    const { password, confirmPassword } = req.body;
    if (!password === confirmPassword)
      throw new Error("Confirm Password does not match");
    const user = req.user;
    // user.password = password;
    console.log(user);
    res.send("Password Updated");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = profileRouter;
