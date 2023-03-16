const express = require("express");
const cors = require("cors");
const app = express();
// const socketio = require("socket.io");
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*"
  }
});

//enable cors middleware
// app.use(cors());
app.get("/", (req, res) => {
  res.render("/");
});

// listen for incoming socket.io connections
io.on("connection", (socket) => {
  console.log(`New client connected: ${socket.id} `);
  // alert("New user connected")

  // Listen for incoming chat messages
  socket.on("message", (msg) => {
    console.log(`Received message: ${msg}`);

    // Broadcast the message to all connected clients
    io.emit("message", {
      message: msg,
      sender: socket.id,
      timestamp: Date.now()
    });
  });

  // Listen for client disconnections
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// start the server listening on port 5000
server.listen(5000, () => {
  console.log("Server up and running on port 5000");
});
