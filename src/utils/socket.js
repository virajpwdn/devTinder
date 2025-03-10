const socket = require("socket.io");
const crypto = require("crypto");

const createRoomId = ({ targetId, userId }) => {
  return crypto
    .createHash("sha256")
    .update([targetId, userId].sort().join("_"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: { origin: "http://localhost:5173" },
  });

  io.on("connection", (socket) => {
    console.log("Socket is Connected");

    socket.on("joinChat", ({ targetId, userId }) => {
      const room = createRoomId(targetId, userId);
      console.log(room);
      socket.join(room);
      // console.log("Joining Room:", room);
    });

    socket.on("sendMessage", ({ firstName, userId, targetId, newMessage }) => {
      // console.log(firstName, userId, targetId, newMessage);
      const room = createRoomId(targetId, userId);
      console.log(room);
      io.to(room).emit("messageReceived", { firstName, newMessage });
    });

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
