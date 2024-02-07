const express = require("express");
const router = express.Router();
const { publicPosts, privatePosts } = require("../db");
const {validateToken} = require("../middleware/checkAuth");

router.get("/public", (req, res) => {
    res.json(publicPosts)
})

router.get("/private", validateToken, (req, res) => {
    res.json(privatePosts)
})

module.exports = router