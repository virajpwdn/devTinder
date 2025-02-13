const mongoose = require("mongoose");
const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Types.ObjectId,
      required: true,
      index: true,
      ref: "user",
    },
    toUserId: {
      type: mongoose.Types.ObjectId,
      required: true,
      index: true,
      ref: "user",
    },
    status: {
      type: String,
      enum: {
        values: ["accepted", "rejected", "ignored", "interested"],
        message: `{VALUE} is not valid type`,
      },
    },
  },
  { timestamps: true }
);

connectionRequestSchema.pre("save", function (next) {
  if (this.fromUserId == this.toUserId)
    throw new Error(`You cannot send request to yourself`);
  next();
});

const ConnectionRequestModel = mongoose.model(
  "Connection Request",
  connectionRequestSchema
);
module.exports = ConnectionRequestModel;
