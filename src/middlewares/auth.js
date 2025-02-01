const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authenticate = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    const decode = jwt.verify(token, "devtinder@123");
    
    const user = await User.findById({ _id: decode._id });
    if (!user) throw new Error("User not found");
    req.user = user;
    next();
  } catch (error) {
    res.status(400).json("ERROR: " + error.message);
  }
};

module.exports = {
  authenticate,
};
