const express = require("express");
const cors = require("cors");
const server = express();
require("dotenv").config();

server.use(
  cors({
    origin: process.env.LOCAL_HOST,
    methods: ["GET", "POST"],
  })
);

const auth = require("./routes/auth");
server.use("/", auth);

const test = require("./routes/test");
server.use("/", test);

const user = require("./routes/user");
server.use("/user", user);

server.listen(process.env.PORT, () => {
    console.log(`Server is running on port: ${process.env.PORT}`);
  });