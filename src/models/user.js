const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  emailId: {
    type: String,
  },
  password: {
    type: Number,
  },
  gender: {
    type: String,
  },
  age: {
    type: Number,
  },
});

module.exports = mongoose.model("user", userSchema)
