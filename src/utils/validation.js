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

const validateEditProfileData = (req) =>{
  const ALLOWEDFIELDS = [
    "firstName",
    "lastName",
    "gender",
    "bio",
    "age",
    "photo",
    "skills",
  ];


  const isUpdateAllowed = Object.keys(req.body).every((field) => {
    return ALLOWEDFIELDS.includes(field);
  });
  return isUpdateAllowed;
}

module.exports = {
  userDataValidation,
  validateEditProfileData,
};
