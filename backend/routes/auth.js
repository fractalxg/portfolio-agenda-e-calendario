const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { users } = require("../db");
const {createToken} = require("../middleware/checkAuth")

router.use(express.json());

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  const user = users.find((user) => {
    return user.email === email;
  });

  if (user) {
    return res.status(400).json({
      message: "This user already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  users.push({
    email,
    password: hashedPassword,
  });

  return res.json({
    message: "Account created",
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const findUser = users.find((user) => {
    return user.email === email;
  });

  if (!findUser) {
    return res.status(400).json({
      message: "Invalid Credentials",
    });
  }

  const passwordCompare = await bcrypt.compare(password, findUser.password);

  if (!passwordCompare) {
    return res.status(400).json({
      message: "Invalid Credentials",
    });
  }

  res.json(createToken(email));
});

router.get("/all", (req, res) => {
  res.json(users);
});

module.exports = router;
