const express = require("express");
const app = express();
const { connectDB } = require("./src/config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./src/routes/auth.routes");
const profileRouter = require("./src/routes/profile.routes");
const requestRouter = require("./src/routes/request.routes");
const userRouter = require("./src/routes/user.routes");
const cors = require("cors");

// CRON JOB
// require("./src/utils/cronJob");

// Setting up routes for shop page
const shopRouter = require("./src/shop/shop.routes");

// Socketio configurations
const http = require("http");
const initializeSocket = require("./src/utils/socket");
const server = http.createServer(app);
initializeSocket(server);
const chatRouter = require("./src/routes/chat.routes");

const allowedOrigins = [
  "https://devtinder-n4he.onrender.com",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

// shop routes
app.use("/shop", shopRouter);

app.use("/chat", chatRouter);

connectDB()
  .then(() => {
    console.log("Database connected successfully");
    server.listen(3000, () => {
      console.log("Server is running successfully");
    });
  })
  .catch((err) => {
    console.log(err);
  });
