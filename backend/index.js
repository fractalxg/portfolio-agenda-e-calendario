const express = require("express");
const cors = require("cors");
const server = express();
const http = require("http");
const socketServer = http.createServer(server);
require("dotenv").config();

server.use(cors());

const io = require("socket.io")(socketServer, {
  cors: {
    origin: process.env.LOCAL_HOST,
    methods: ["GET", "POST"],
  },
});

const auth = require("./routes/auth");
server.use("/auth", auth);

const user = require("./routes/user");
server.use("/user", user);

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("userData", () => {
    socket.emit("userData", { userId: socket.id });
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded");
    console.log("User Disconnected", socket.id);
  });

  socket.on("callUser", (data) => {
    io.to(data.userToCall).emit("callUser", {
      signal: data.signalData,
      from: data.from,
      //name: data.name,
      
    });
    
  });

  socket.on("answerCall", (data) => {
    io.to(data.to).emit("answerCall", data.signal);
  });
});

server.listen(process.env.DB_PORT, () => {
  console.log(`DB Server is running on port: ${process.env.DB_PORT}`);
});

socketServer.listen(process.env.SOCKET_PORT, () => {
  console.log(`Socket Server is running on port: ${process.env.SOCKET_PORT}`);
});
