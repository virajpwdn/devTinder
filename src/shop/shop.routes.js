const { Router } = require("express");
const shopRouter = Router();
const { authenticate } = require("../middlewares/auth");
const razorpayOrder = require("../utils/razorpay");
const Payment = require("../models/payment");
const { membershipAmout } = require("../utils/constants");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");
const User = require("../models/user");


shopRouter.post("/payment/create", authenticate, async (req, res) => {
  try {
    const { membershipType } = req.body;

    const order = await razorpayOrder.orders.create({
      amount: membershipAmout[membershipType] * 100,
      currency: "INR",
      receipt: "receipt#1",
      partial_payment: false,
      notes: {
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.emailId,
        membershipType: membershipType,
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
      notes: {
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        emailId: req.user.emailId,
        membershipType: order.notes.membershipType,
      },
    });

    await savedPayment.save();

    res
      .status(201)
      .json({ ...savedPayment.toJSON(), key: process.env.RAZOR_PAY_KEY });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

shopRouter.post("/payment/webhook", async (req, res) => {
  try {
    const webHookSignature = req.header("X-Razorpay-Signature");

    const isValidateSignature = validateWebhookSignature(
      JSON.stringify(req.body),
      webHookSignature,
      process.env.RAZOR_PAY_WEBHOOK_KEY
    );
    if (!isValidateSignature) throw new Error("Webhook signature not valid");

    const paymentDetails = req.body.payload.payment.entity;

    // update the status into database
    const updatePaymentDetails = await Payment.findOne({_id: paymentDetails.order_id})
    updatePaymentDetails.status = paymentDetails.status;
    await updatePaymentDetails.save();

    // update user details -> update it's memberType, and which membership plan user has bought
    const user = await User.findOne({_id: updatePaymentDetails.userId})
    user.isPremium = true;
    user.membershipType = updatePaymentDetails.notes.membershipType;
    await user.save();

    // return status code (200) -> which will let razor pay know that transication is successfull otherwise it will end up in infinity loop
    res.status(200).json({message: "webhook is created successfully"})

  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = shopRouter;
