const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const {createToken} = require("../middleware/checkAuth")
const { User } = require("../models");

router.use(express.json());

router.post("/login", async (req, res) => {

  const { login, password } = req.body;

  const findUser = await User.findOne({
    where: {
      login: login,
    },
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

  res.status(201).json(createToken(login));
});

module.exports = router;
