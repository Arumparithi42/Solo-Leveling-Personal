const express = require("express");
const router = express.Router();
const { getUser } = require("../controllers/userController");

// GET /api/user
router.get("/", getUser);

module.exports = router;
