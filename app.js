const express = require("express");
const app = express();
const { authenticate } = require("./src/middlewares/auth");
const { connectDB } = require("./src/config/database");
const User = require("./src/models/user");

// app.use("/admin", authenticate);

app.use(express.json());

app.get("/admin/login", authenticate, (req, res, next) => {
  res.send("This are details");
});

app.post("/signup", async (req, res, next) => {
  const user = new User(req.body);
  console.log(user);

  try {
    await user.save();
    res.send("Data is added to database successufully");
  } catch (error) {
    console.log(error);
    res.send("Something went wrong " + error.message);
  }
});

app.get("/details", async (req, res) => {
  // const emailId = ;
  // console.log(emailId);

  try {
    const users = await User.findOne({ emailId: req.body.emailId });
    if (users === null) {
      res.status(404).send("Not found user");
    } else {
      res.send(users);
    }
  } catch (error) {
    res.send("There is some error");
    console.log(error);
  }
});

app.get("/feed", async (req, res) => {
  //   const user = req.body.emailId;

  try {
    const allusers = await User.find({});
    res.send(allusers);
  } catch (error) {
    res.send("There is an error");
  }
});

app.get("/findid", async (req, res) => {
  const { id } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      res.status(404).send("user not found");
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(404).send("Not found");
  }
});

app.delete("/delete", async (req, res) => {
  const id = req.body.id;

  try {
    // await User.findByIdAndDelete(id);
    await User.findByIdAndDelete({ _id: id });
    res.send("user deleted successfully");
  } catch (error) {
    res.send("Some errors");
  }
});

app.patch("/updatedata/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
    console.log(userId);
  try {
    const ALLOWED_FIELDS = [
      "firstName",
      "lastName",
      "bio",
      "gender",
      "photo",
      "skills",
      "password",
      "age",
    ];
    const isAllowed = Object.keys(data).every((k) => {
      return ALLOWED_FIELDS.includes(k);
    });

    console.log(isAllowed);
    if (!isAllowed) {
      throw new Error("Update not allowed");
    }
    // console.log(data.skills);
    if(data?.skills.length > 5){
        throw new Error("Cannot pass skills more then 5");
    }

    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });
    console.log(user);
    res.send("User data updated");
  } catch (error) {
    res.status(400).send("update failed " + error.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(3000, () => {
      console.log("Server is running successfully");
    });
  })
  .catch((err) => {
    console.log(err);
  });
