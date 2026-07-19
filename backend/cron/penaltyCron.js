const cron = require("node-cron");
const User = require("../models/User");

// Runs every day at 12:00 AM (server time).
// If the daily quest wasn't fully completed, add a penalty point.
// Either way, reset all daily missions and dailyprogress for the new day.
const scheduleDailyPenalty = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      const user = await User.findOne();
      if (!user) return;

      // Daily quest: penalize if not fully completed by end of day
      if (user.dailyprogress !== 100) {
        user.penalty += 1;
      }

      // Bonus quest: reward if fully completed by end of day
      if (user.bonusprogress === 100) {
        user.penalty = Math.max(0, user.penalty - 1);
      }

      user.dailyquest.forEach((mission) => {
        mission.done = false;
      });
      user.dailyprogress = 0;

      user.bonusquest.forEach((mission) => {
        mission.done = false;
      });
      user.bonusprogress = 0;

      await user.save();
      console.log(`[cron] Daily + Bonus reset complete. Penalty: ${user.penalty}`);
    } catch (error) {
      console.error("[cron] Daily penalty job failed:", error.message);
    }
  });
};

// Runs every Monday at 12:00 AM (server time).
// If the weekly quest wasn't fully completed, add a penalty point.
// Either way, reset all weekly missions and weeklyprogress for the new week.
const scheduleWeeklyPenalty = () => {
  cron.schedule("0 0 * * 1", async () => {
    try {
      const user = await User.findOne();
      if (!user) return;

      if (user.weeklyprogress !== 100) {
        user.penalty += 1;
      } 
      else {
        user.penalty = Math.max(0, user.penalty - 2);
      }

      user.weeklyquest.forEach((mission) => {
        mission.done = false;
      });
      user.weeklyprogress = 0;

      await user.save();
      console.log(`[cron] Weekly reset complete. Penalty: ${user.penalty}`);
    } catch (error) {
      console.error("[cron] Weekly penalty job failed:", error.message);
    }
  });
};
// Registers both cron jobs. Call once from server.js on startup.
const startPenaltyCronJobs = () => {
  scheduleDailyPenalty();
  scheduleWeeklyPenalty();
  console.log("Penalty cron jobs scheduled (daily 00:00, weekly Monday 00:00)");
};

module.exports = startPenaltyCronJobs;
