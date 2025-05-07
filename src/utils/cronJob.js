const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const ConnectionModel = require("../models/connectionRequestion");
const sendEmail = require("../utils/sendEmail");

const yesterdayTime = subDays(new Date, 1);
const yesterdayStart = startOfDay(yesterdayTime); /* startOfDay function returns date - 1 but time is reset to 00:00 */
const yesterdayEnd = endOfDay(yesterdayTime); /* date is -1 and time is reseted to 11:59:59 */

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

    /* In the above code listOfEmails -> first map is running on pendingrequestofyesterday and it returns new array this new array is passed to set then set does its filtering and creates object this object is then conveted into array. The reason we it into array is because it then becomes easy to iterate in the next operation we are sending email to this email id's so it makes the process easy because array has inbuild methods like forEach, map to iterate although converting it into array is optional */

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
