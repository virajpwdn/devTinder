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
      default:
        "https://imgs.search.brave.com/5cAi-jXDh0PdCGuh2vvsggwMUWvGlmTFmbCQ7jYJ9OI/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAyLzE1Lzg0LzQz/LzM2MF9GXzIxNTg0/NDMyNV90dFg5WWlJ/SXllYVI3TmU2RWFM/TGpNQW15NEd2UEM2/OS5qcGc",
      validate: (value) => {
        if (!validator.isURL(value)) {
          throw new Error("Enter correct image url");
        }
      },
    },

    coverPhoto: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?q=80&w=3264&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      // validate: (value) => {
      //   if (!validator.isURL(value)) {
      //     throw new Error("Enter correct cover photo url");
      //   }
      // },
    },

    bio: {
      type: String,
      default: "Write your bio to find people",
    },

    skills: {
      type: Array,
    },

    membershipType: {
      type: String,
    },

    isPremium: {
      type: String,
      default: false,
    },
    socialLinks: {
      linkedIn: {
        type: String,
        default: "",
      },
      twitter: {
        type: String,
        default: "",
      },
      instagram: {
        type: String,
        default: "",
      },
      gitHub: {
        type: String,
        default: "",
      },
      website: {
        type: String,
        default: "",
      },
    },
  },

  { timestamps: true },
);

userSchema.methods.getJWT = async function () {
  const user = this;

  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
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
