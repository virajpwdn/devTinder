const socket = require("socket.io");

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: { origin: "http://localhost:5173" },
  });

  io.on("connection", (socket) => {
    console.log("Socket is Connected");

    socket.on("joinChat", ({targetId, userId}) => {
        const room = [targetId, userId].sort().join("_");
        socket.join(room);
        // console.log("Joining Room:", room);
    });

    socket.on("sendMessage", ({firstName, userId, targetId, newMessage}) => {
        // console.log(firstName, userId, targetId, newMessage);
        const room = [targetId, userId].sort().join("_");
        console.log(room);
        io.to(room).emit("messageReceived", {newMessage});
    });

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
