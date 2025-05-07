const socket = require("socket.io");
const crypto = require("crypto");
const Chat = require("../models/chat");

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
    socket.on("joinChat", ({ targetId, userId }) => {
      const room = createRoomId(targetId, userId);
      socket.join(room);
    });

    socket.on(
      "sendMessage",
      async ({ firstName, lastName, userId, targetId, newMessage }) => {
        try {
          let chat = await Chat.findOne({
            participants: { $all: [userId, targetId] },
          });

          if (!chat) {
            chat = new Chat({ participants: [userId, targetId], messages: [] });
            await chat.save();
          }

          chat.messages.push({
            senderId: userId,
            text: newMessage,
            seenStatus: "Delivered",
          });
          await chat.save();
          const room = createRoomId(targetId, userId);
          io.to(room).emit("messageReceived", { firstName, newMessage });
        } catch (error) {
          console.error(error);
        }
      }
    );

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
