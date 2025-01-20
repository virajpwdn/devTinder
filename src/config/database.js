const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://alphadeveloper:c2zkQ04lrFjRC6F8@cluster0.j7cia.mongodb.net/devTinder"
  );
};

module.exports = {
  connectDB,
};
