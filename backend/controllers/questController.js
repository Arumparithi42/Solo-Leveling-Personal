// Finds a mission subdocument by its _id inside a given quest array.
// Throws a 404-style error object if not found so callers can respond consistently.
const findMission = (questArray, missionId) => {
  const mission = questArray.id(missionId); // Mongoose DocumentArray#id lookup by _id
  return mission;
};

// PUT /api/daily/:missionId
// Toggles a daily mission's "done" flag and recalculates dailyprogress.
const toggleDaily = async (req, res) => {
  try {
    const user = req.currentUser;
    const mission = findMission(user.dailyquest, req.params.missionId);

    if (!mission) {
      return res.status(404).json({ message: "Daily mission not found" });
    }

    if (user.dailyprogress === 100) {
      return res.status(200).json(user);
    }

    mission.done = !mission.done;
    user.dailyprogress = user.calculateProgress(user.dailyquest);

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to update daily quest", error: error.message });
  }
};

// PUT /api/bonus/:missionId
// Toggles a bonus mission's "done" flag, recalculates bonusprogress, and
// reduces penalty by 1 the moment bonusprogress newly reaches 100.
// PUT /api/bonus/:missionId
// Toggles a bonus mission's "done" flag and recalculates bonusprogress.
// The penalty discount for hitting 100% is applied/reversed through the
// bonusRewardClaimed flag, so it can only ever be applied once per day —
// toggling back and forth doesn't stack decrements.
// PUT /api/bonus/:missionId
// Toggles a bonus mission's "done" flag and recalculates bonusprogress.
// Penalty is NOT touched here — the reward for finishing bonus quest is
// only evaluated once, at midnight, in the daily cron job.
const toggleBonus = async (req, res) => {
  try {
    const user = req.currentUser;
    const mission = findMission(user.bonusquest, req.params.missionId);

    if (!mission) {
      return res.status(404).json({ message: "Bonus mission not found" });
    }

    mission.done = !mission.done;
    user.bonusprogress = user.calculateProgress(user.bonusquest);

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to update bonus quest", error: error.message });
  }
};

// PUT /api/weekly/:missionId
// Toggles a weekly mission's "done" flag and recalculates weeklyprogress.
const toggleWeekly = async (req, res) => {
  try {
    const user = req.currentUser;
    const mission = findMission(user.weeklyquest, req.params.missionId);

    if (!mission) {
      return res.status(404).json({ message: "Weekly mission not found" });
    }

    mission.done = !mission.done;
    user.weeklyprogress = user.calculateProgress(user.weeklyquest);

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to update weekly quest", error: error.message });
  }
};

module.exports = { toggleDaily, toggleBonus, toggleWeekly };
