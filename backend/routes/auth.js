const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const { users } = require("../db");
const jwt = require("jsonwebtoken");

router.use(express.json());

router.post(
  "/signup",
  [
    check("email", "Please provide a valid email").isEmail(),
    check(
      "password",
      "Please provide a password that is greater than 8 characters"
    ).isLength({
      min: 8,
    }),
  ],
  async (req, res) => {
    const { email, password } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    let user = users.find((user) => {
      return user.email === email;
    });

    if (user) {
      res.status(400).json({
        errors: [
          {
            msg: "This users already exists",
          },
        ],
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    users.push({
      email,
      password: hashedPassword,
    });

    console.log(hashedPassword);

    const token = await jwt.sign(
      {
        email,
      },
      process.env.SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.json(token);
  }
);

router.get("/all", (req, res) => {
  res.json(users);
});

module.exports = router;
