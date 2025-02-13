const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      max: 50,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      // required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: (value) => {
        //   if (!value.includes("@")) {
        //     throw new Error("@ is missing");
        //   }
        //   return true;
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid" + value);
        }
        return true;
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      // validate: (value) => {
      //   const length = value.toString().length;
      //   if (length < 3 || length > 50) {
      //     throw new Error("Password length should be in between 3 and 50");
      //   }
      //   return true;
      // },
    },
    gender: {
      type: String,
      validate: (value) => {
        if (!value.includes("male" || "female" || "other")) {
          throw new Error("pick gender between male, female, other");
        }
        return true;
      },
    },
    age: {
      type: Number,
    },

    photo: {
      type: String,
      validate: (value) => {
        if (!validator.isURL(value)) {
          throw new Error("Enter correct image url");
        }
      },
    },

    bio: {
      type: String,
      default: "Write your bio to find people",
    },

    skills: {
      type: Array,
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function () {
  const user = this;

  const token = await jwt.sign({ _id: user._id }, "devtinder@123", {
    expiresIn: "7d",
  });

  return token;
};

userSchema.methods.isValidate = async function (passwordInputByUser) {
  const hashPassword = this.password;
  const authpassword = await bcrypt.compare(passwordInputByUser, hashPassword);
  if (!authpassword) throw new Error("Invalid Credientials");
  return authpassword;
};

module.exports = mongoose.model("user", userSchema);
