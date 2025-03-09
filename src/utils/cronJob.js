const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const ConnectionModel = require("../models/connectionRequestion");
const sendEmail = require("../utils/sendEmail");

const yesterdayTime = subDays(new Date, 1);
const yesterdayStart = startOfDay(yesterdayTime);
const yesterdayEnd = endOfDay(yesterdayTime);

cron.schedule("0 8 * * *", async () => {
    // send email to all people who got requests the previous day
  try {
    const pendingRequestOfYesterday = await ConnectionModel.find({
      status: "interested",
      createdAt: {
        $gte: yesterdayStart,
        $lt: yesterdayEnd,
      },
    }).populate("toUserId fromUserId");

    const listOfEmails = [
      ...new Set(
        pendingRequestOfYesterday.map((req) => {
          return req.toUserId.emailId;
        })
      ),
    ];

    console.log(listOfEmails);

    for (const email of listOfEmails) {
      try {
        const res = await sendEmail.run(
          "New Friend Request is pending for " + email,
          "There are so many friends requests are pending, Login to Devtinder and accept or reject the requests"
        );
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

// module.exports = job;
