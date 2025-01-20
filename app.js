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

app.post("/signup", async (req,res,next)=>{
    const user = new User(req.body);
    console.log(user);

    try {
        await user.save();
        res.send("Data is added to database successufully")
    } catch (error) {
        console.log(error);
        res.send("Something went wrong ", error);
    }
})

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
