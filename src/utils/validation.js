const validator = require("validator");

const userDataValidation = (req) => {
  const { firstName, lastName, password, emailId } = req.body;
  if (!firstName) {
    throw new Error("FirstName does not exist");
  } else if (firstName.length < 3 || firstName.length > 50) {
    throw new Error("FirstName should be in between 3 and 50 words");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Create a strong password");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Verify your email id");
  }
};

const validateEditProfileData = (req) => {
  const ALLOWEDFIELDS = [
    "firstName",
    "lastName",
    "gender",
    "bio",
    "age",
    "photo",
    "skills",
  ];

  const { firstName, lastName, gender, bio, age, photo, skills } = req.body;

  if (firstName?.trim()?.length <= 3) {
    throw new Error("First Name Should be greater then 3");
  }
  if (lastName?.trim()?.length <= 3)
    throw new Error("Last Name Should be greater then 3");

  if (bio?.trim()) {
    const bioLength = bio.trim().length;
    if (bioLength < 3 || bioLength > 100)
      throw new Error("bio length should be in between 3 and 100");
  }

  if (photo?.trim() && !validator.isURL(photo.trim()))
    throw new Error("Photo URL is not valid");
  if (Array.isArray(skills) && skills.length > 5)
    throw new Error("skills can be added upto 5");

  const isUpdateAllowed = Object.keys(req.body).every((field) => {
    return ALLOWEDFIELDS.includes(field);
  });

  if (!isUpdateAllowed) {
    throw new Error("Invalid field in edit request");
  }
  return true;
};

module.exports = {
  userDataValidation,
  validateEditProfileData,
};
