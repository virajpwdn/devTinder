const express = require("express");
const app = express();
const { authenticate } = require("./src/middlewares/auth");
const { connectDB } = require("./src/config/database");
const User = require("./src/models/user");
const { userDataValidation } = require("./src/utils/validation");

const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");


// app.use("/admin", authenticate);
app.use(express.json());
app.use(cookieParser())

app.get("/admin/login", authenticate, (req, res, next) => {
  res.send("This are details");
});

app.post("/signup", async (req, res, next) => {
  // console.log(user);

  try {
    userDataValidation(req);
    const { firstName, lastName, password, emailId } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      password: hashPassword,
      emailId,
    });

    await user.save();
    res.send("Data is added to database successufully");
  } catch (error) {
    console.log(error);
    res.send("ERROR : " + error.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if(!emailId || !password){
      throw new Error("Credentials are necessary");
    }
    const user = await User.findOne({ emailId: emailId });
   console.log(user);
    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const authpassword = await bcrypt.compare(password, user.password);
    if (!authpassword) {
      throw new Error("Invalid Credentials");
    } 
    // Create Token
    const token = jwt.sign({_id:user._id}, "devtinder@123")

    // Add token inside of cookie
    res.cookie("token", token)
    res.send("Logged In Successfully...");
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

app.get("/profile", (req,res)=>{
  const cookie = req.cookies;
  const {token} = cookie;
  // Verify Token
  const decodedMsg = jwt.verify(token, "devtinder@123");
  console.log(decodedMsg);
  // console.log(token);
  res.send("Hey")
})

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

    if (!isAllowed) {
      throw new Error("Changing email is not allowed");
    }
    // console.log(data.skills);
    if (data.skills && data?.skills.length > 5) {
      throw new Error("Cannot pass skills more then 5");
    }

    const user = await User.findByIdAndUpdate(userId, data, {
      returnDocument: "after",
      runValidators: true,
    });
    if (!user) {
      throw new Error("User not found");
    }
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
