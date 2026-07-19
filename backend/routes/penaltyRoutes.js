const express = require("express");
const router = express.Router();
const { getPenalty, compensate } = require("../controllers/penaltyController");

// This router is mounted at /api in server.js, so the full paths are:
// GET  /api/penalty
// POST /api/compensate
router.get("/penalty", getPenalty);
router.post("/compensate", compensate);

module.exports = router;
