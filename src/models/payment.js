const mongoose = require("mongoose");
const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "user id is required"],
    },
    paymentId: {
      type: String,
    },
    orderId: {
      type: String,
      required: [true, "order id is required"],
    },
    status: {
      type: String,
      required: [true, "status is required"],
    },
    amount: {
      type: Number,
      required: [true, "amount is required"],
    },
    currency: {
      type: String,
      required: [true, "currency type is required"],
    },
    receipt: {
      type: String,
    },
    offerId: {
      type: String,
    },
    notes: {
      firstName: {
        type: String,
      },
      lastName: {
        type: String,
      },
      emailId: {
        type: String,
        required: [true, "email is required"],
      },
      membershipType: {
        type: String,
        required: [true, "membership type is required"],
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("payment", paymentSchema);
