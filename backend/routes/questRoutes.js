const express = require("express");
const router = express.Router();
const { toggleDaily, toggleBonus, toggleWeekly } = require("../controllers/questController");

// This router is mounted at /api in server.js, so the full paths are:
// PUT /api/daily/:missionId
// PUT /api/bonus/:missionId
// PUT /api/weekly/:missionId
router.put("/daily/:missionId", toggleDaily);
router.put("/bonus/:missionId", toggleBonus);
router.put("/weekly/:missionId", toggleWeekly);

module.exports = router;
