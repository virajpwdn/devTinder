const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SERVICE_SID } =
  process.env;
const client = require("twilio")(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, {
  lazyLoading: true,
});

/**
 * send otp
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */

module.exports.sendOtp = async (req, res, next) => {
  const { countryCode, phoneNumber } = req.body;
  try {
    const otpResponse = await client.verify
      .v2.services(TWILIO_SERVICE_SID)
      .verifications.create({
        to: `+${countryCode}${phoneNumber}`,
        channel: "sms",
      });

    console.log(otpResponse);
    res.status(200).json({ message: "OTP sent successful" });
  } catch (error) {
    console.error(error);
  }
};

module.exports.verifyOtp = async (req, res, next) => {
  const { countryCode, phoneNumber, otp } = req.body;
  try {
    const verifiedResponse = await client.verify
      .v2.services(TWILIO_SERVICE_SID)
      .verificationChecks.create({
        to: `+${countryCode}${phoneNumber}`,
        code: otp,
      });

    console.log(verifiedResponse);
    res.status(200).json({ message: "otp is verified" });
  } catch (error) {
    console.error(error);
  }
};

