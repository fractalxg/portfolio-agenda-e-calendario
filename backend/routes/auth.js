const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { users } = require("../db");
const jwt = require("jsonwebtoken");

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

  const signUpAccessToken = jwt.sign(
    {
      email,
    },
    process.env.SECRET,
    {
      expiresIn: "1d",
    }
  );

  res.json(signUpAccessToken);
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

  const loginAccessToken = jwt.sign(
    {
      email,
    },
    process.env.SECRET,
    {
      expiresIn: "1h",
    }
  );

  res.json(loginAccessToken);
});

router.get("/all", (req, res) => {
  res.json(users);
});

module.exports = router;
