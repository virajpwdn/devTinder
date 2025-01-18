const express = require("express");
const app = express();
const { authenticate } = require("./src/middlewares/auth");

// app.use("/", authenticate);

app.get("/users", (req, res, next) => {
  res.send("This is first response, nameste");
});

app.get("/user00", (req,res,next)=>{
    try {
        throw new Error("error found");
        res.send("Data sent");
    } catch (error) {
        console.log(error);
        res.send("There is some error")
    }
    
})

// app.get(
//   "/users/admin",
//   (req, res, next) => {
//     console.log("This is first admin check");
//     // res.send("Response");
//     next();
//   },
//   (req, res, next) => {
//     console.log("This is second admin check");
//     next();
//   },
//   (req, res) => {
//     res.send("Final response");
//   }
// );

app.listen(3000, () => {
  console.log("Server is running successfully");
});
