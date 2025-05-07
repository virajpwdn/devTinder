const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "sender id is missing"],
    },
    text: {
      type: String,
    },
    seenStatus: {
      type: String,
    },
    timestamp: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

const chatSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Participants IDs are required"],
    },
  ],
  messages: [messageSchema],
});

module.exports = mongoose.model("chat", chatSchema);
