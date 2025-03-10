const express = require("express");
const app = express();
const { connectDB } = require("./src/config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./src/routes/auth.routes");
const profileRouter = require("./src/routes/profile.routes");
const requestRouter = require("./src/routes/request.routes");
const userRouter = require("./src/routes/user.routes");
const cors = require("cors");

// require("./src/utils/cronJob");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

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
