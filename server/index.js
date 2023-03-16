const express = require("express");
const cors = require("cors");
const app = express();

const { Server } = require("socket.io");
app.use(cors());
const server = require("http").createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log(`User connected :${socket.id}`);

  io.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with id: ${socket.id} joined room ${data}`);

    socket.on("send_message", (data) => {
      console.log(data);
      socket.to(data.room).emit("receive_message", data);
    });
  });

  io.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = 5000;

server.listen(PORT, () => {
  console.log(`Server is up and running on  port ${PORT}`);
});
