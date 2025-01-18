const express = require("express");
const app = express();


app.get("/ab?c", (req, res)=>{
    res.send({userName: "kartik", lastName: "Aaryan"});
})

app.get("/ab+c", (req, res)=>{
    res.send({userName: "kartik", lastName: "Aaryan"});
})

app.get("/ab*c", (req, res)=>{
    res.send({userName: "kartik", lastName: "Aaryan"});
})

app.get("/a(bc)?d", (req, res)=>{
    res.send({userName: "kartik", lastName: "Aaryan"});
})

app.get("/user:userID", (req, res)=>{
    console.log(req.params);
    res.send({userName: "kartik", lastName: "Aaryan"});
})

app.get(/.*fly$/, (req, res)=>{
    // console.log(req.query);
    res.send({userName: "kartik", lastName: "Aaryan"});
})

app.post("/user", (req,res)=>{
    // logic to change will come here
    res.send("Data Successfully Created");
})

app.patch("/user", (req, res)=>{
    res.send("Data updated successfully");
})

app.delete("/user", (req,res)=>{
    res.send("Data deleted successfully");
})

app.use("/test", (req, res) => {
  res.send("This is a test route");
});



app.listen(3000, () => {
  console.log("Server is running successfully");
});
