const express = require("express");
const app = express();

app.use("/hello", (req, res) => {
  res.send("This hello page guys");
});
app.use((req, res) => {
  res.send("Welcome to the server friends");
});


app.listen(3000, () => {
  console.log("Server is running successfully");
});
