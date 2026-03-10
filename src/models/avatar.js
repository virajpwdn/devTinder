const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema({
  filePath: {
    type: String,
    required: true,
  },
  fileId: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
  },
  height: {
    type: String,
  },
  width: {
    type: String,
  },
  url: {
    type: String,
    required: true,
  },
  size: {
    type: String,
  },
});

const AvatarSchema = new mongoose.Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true,
      index: true,
    },
    photos: {
      type: [photoSchema],
      default: [],
      required: true,
      validate: {
        validator: (arr) => arr.length <= 6,
        message: "Maximum 6 photos allowed",
      },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Avatars", AvatarSchema);
