const { Router } = require("express");
const shopRouter = Router();
const { authenticate } = require("../middlewares/auth");
const razorpayOrder = require("../utils/razorpay");

shopRouter.post("/payment/create", authenticate, async (req, res) => {
  try {
    const order = await razorpayOrder.orders.create({
      amount: 10000,
      currency: "INR",
      receipt: "receipt#1",
      partial_payment: false,
      notes: {
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.emailId,
        membershipType: "gold"
      },
    });
    console.log(order);
    res.status(201).json({order})
  } catch (error) {
    res.status(400).json({message: error.message})
  }
});

module.exports = shopRouter;
