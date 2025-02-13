// In this file all the routes which are related to Authentication will be controller from here
const { Router } = require("express");
const authRouter = Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { userDataValidation } = require("../utils/validation");

authRouter.post("/signup", async (req, res, next) => {
  // console.log(user);

  try {
    userDataValidation(req);
    const { firstName, lastName, password, emailId, age, skills, bio, gender } =
      req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      password: hashPassword,
      emailId,
      age,
      skills,
      bio,
      gender,
    });

    await user.save();
    res.send("Data is added to database successufully");
  } catch (error) {
    // console.log(error);
    res.status(400).send("ERROR : " + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!emailId || !password) {
      throw new Error("Credentials are necessary");
    }
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credientials");
    }

    const isValidate = await user.isValidate(password);
    if (!isValidate) throw new Error("Invalid Credientials");
    // Create Token

    const token = await user.getJWT();

    // Add token inside of cookie
    res.cookie("token", token, {
      expires: new Date(Date.now() + 12 * 3600000),
    });
    res.send("Logged In Successfully...");
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(0),
  });
  res.send("user logout successfully...");
});

module.exports = authRouter;
