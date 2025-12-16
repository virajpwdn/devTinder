require("dotenv").config();
const express = require("express");
const app = express();
const { connectDB } = require("./src/config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./src/routes/auth.routes");
const profileRouter = require("./src/routes/profile.routes");
const requestRouter = require("./src/routes/request.routes");
const userRouter = require("./src/routes/user.routes");
const cors = require("cors");
const { register, client } = require("./src/utils/observability/prometheus");
const logger = require("./src/utils/observability/logger")

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
  "https://devtinder-frontend-qu2k.onrender.com",
  "http://localhost:5173",
  "localhost",
  "https://devtinder.virajpatwardhan.in",
  "http://backend:3000",
  "http://backend",
  "http://localhost",
  "http://localhost:80",
  "http://backend:80",
  "http://127.0.0.1",
  "http://127.0.0.1:3000",
  "http://0.0.0.0:3000",
];


logger.info("Application started");


app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/metrics", async (req, res) => {
  res.setHeader("Content-Type", client.register.contentType);
  const metrics = await client.register.metrics();
  res.send(metrics);
});

app.get("/health", (req,res) => {
  res.status(200).json({status: "Server is up and running!"})
})

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

// shop routes
app.use("/shop", shopRouter);

app.use("/chat", chatRouter);

connectDB()
  .then(() => {
    // console.log("Database connected successfully");
    logger.info("Database is connected")
    server.listen(process.env.PORT, () => {
      // console.log("Server is running successfully");
      logger.info("Server is running successfully`")
    });
  })
  .catch((err) => {
    console.log(err);
  });
