const { validateEditProfileData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");

module.exports.profileViewController = async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json(user);
  } catch (error) {
    throw new Error("ERROR " + error.message);
  }
};

module.exports.profileEditController = async (req, res) => {
  try {
    if (!validateEditProfileData(req)) throw new Error("Invalid Edit Request");
    const ALLOWED_FIELDS = [
      "firstName",
      "lastName",
      "gender",
      "age",
      "bio",
      "photo",
      "skills",
      "socialLinks",
    ];

    const oldData = req.user;
    const newData = req.body;
    ALLOWED_FIELDS.forEach((key) => {
      if (newData[key] !== undefined) {
        oldData[key] = newData[key];
      }
    });

    await oldData.save();

    res.status(200).json({
      message: `${oldData.firstName}, your profile is updated successfully`,
      data: oldData,
    });
  } catch (error) {
    res.status(400).json("ERROR: " + error.message);
  }
};

module.exports.forgotPasswordController = async (req, res) => {
  try {
    // const { email } = req.body;
    const user = req.user;
    const { password, confirmpassword } = req.body;
    if (password !== confirmpassword) throw new Error("Password not matched");

    if (!validator.isStrongPassword(password))
      throw new Error("Enter a Strong Password");
    const hashPassword = await bcrypt.hash(password, 10);
    user.password = hashPassword;
    await user.save();
    res.status(200).json({ message: "data successfully updated" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
