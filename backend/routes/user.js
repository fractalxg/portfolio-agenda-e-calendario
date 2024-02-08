const express = require("express");
const router = express.Router();
const { User } = require("../models");

router.use(express.json());

router.post("/create", async (req, res) => {
  const { login, password } = req.body;
  try {
    const user = await User.create(login, password);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/all", async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/update/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const [rowsUpdated, [user]] = await User.update(req.body, {
      returning: true,
      where: { id },
    });
    if (rowsUpdated === 0) {
      res.status(404).json({ error: "User not found" });
    } else {
      res.json(user);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const deletedCount = await User.destroy({ where: { id } });
    if (deletedCount === 0) {
      res.status(404).json({ error: "User not found" });
    } else {
      res.status(204).end();
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
