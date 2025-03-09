const { Router } = require("express");
const shopRouter = Router();
const { authenticate } = require("../middlewares/auth");
const razorpayOrder = require("../utils/razorpay");
const Payment = require("../models/payment")
const {membershipAmout} = require("../utils/constants");

shopRouter.post("/payment/create", authenticate, async (req, res) => {
  try {
    const {membershipType} = req.body

    const order = await razorpayOrder.orders.create({
      amount: membershipAmout[membershipType] * 100,
      currency: "INR",
      receipt: "receipt#1",
      partial_payment: false,
      notes: {
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.emailId,
        membershipType: membershipType
      },
    });

    // saving this order details into DB
    const savedPayment = new Payment({
        userId: req.user._id,
        orderId: order.id,
        status: order.status,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        offerId: order.offer_id,
        notes:{
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            emailId: req.user.emailId,
            membershipType: order.notes.membershipType,
        }
    })

    await savedPayment.save();

    res.status(201).json({...savedPayment.toJSON(), key: process.env.RAZOR_PAY_KEY})
  } catch (error) {
    res.status(400).json({message: error.message})
  }
});

module.exports = shopRouter;
