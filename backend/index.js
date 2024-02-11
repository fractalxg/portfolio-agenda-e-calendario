const express = require("express");
const cors = require("cors");
const server = express();
require("dotenv").config();

server.use(
  cors()
);

const auth = require("./routes/auth");
server.use("/auth", auth);

const user = require("./routes/user");
server.use("/user", user);

server.listen(process.env.PORT, () => {
    console.log(`Server is running on port: ${process.env.PORT}`);
  });