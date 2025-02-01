const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authenticate = async (req, res, next) => {
  try {
    const { token } = req.body;
    const decode = await jwt.verify(token, "devtinder@123");
    console.log(decode);
    const findUser = await User.findById({ _id: decode });
    if (!findUser) throw new Error("User not found");
    res.send(findUser);
  } catch (error) {
    res.status(400).json("ERROR: " + error.message);
  }
};

module.exports = {
  authenticate,
};
