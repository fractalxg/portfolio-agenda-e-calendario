const express = require("express");
const router = express.Router();
const { publicPosts, privatePosts } = require("../db");
const tokenValidation = require("../middleware/checkAuth");

router.get("/public", (req, res) => {
    res.json(publicPosts)
})

router.get("/private", tokenValidation, (req, res) => {
    res.json(privatePosts)
})

module.exports = router