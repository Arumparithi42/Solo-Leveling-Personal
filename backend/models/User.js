const mongoose = require("mongoose");

// A single quest/mission item. Mongoose auto-generates an _id for every
// subdocument in this array — that _id is what the frontend/routes refer to
// as "missionId".
const missionSchema = new mongoose.Schema({
  mission: { type: String, required: true },
  done: { type: Boolean, default: false },
});

// A compensation log entry (created when the user "pays off" a penalty point)
const compensateSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    description: { type: String, required: true },
  },
  { _id: false }
);

// A single todo item on the /todo page
const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  completed: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, default: "Hunter" },

    dailyquest: [missionSchema],
    bonusquest: [missionSchema],
    weeklyquest: [missionSchema],

    dailyprogress: { type: Number, default: 0, min: 0, max: 100 },
    bonusprogress: { type: Number, default: 0, min: 0, max: 100 },
    weeklyprogress: { type: Number, default: 0, min: 0, max: 100 },

    penalty: { type: Number, default: 0, min: 0 },

    compensate: [compensateSchema],

    todoList: [todoSchema],
  },
  { timestamps: true, collection: "users" }
);

// ---- Instance helpers -----------------------------------------------------

// Recalculates a progress percentage from a quest array's "done" flags.
// This is the ONLY place progress numbers are produced — never trust a
// progress value coming from the client.
userSchema.methods.calculateProgress = function (questArray) {
  if (!questArray || questArray.length === 0) return 0;
  const completed = questArray.filter((m) => m.done).length;
  return Math.round((completed / questArray.length) * 100);
};

// Recomputes and stores dailyprogress/bonusprogress/weeklyprogress based on
// the current state of each quest array. Call this after mutating any quest.
userSchema.methods.refreshAllProgress = function () {
  this.dailyprogress = this.calculateProgress(this.dailyquest);
  this.bonusprogress = this.calculateProgress(this.bonusquest);
  this.weeklyprogress = this.calculateProgress(this.weeklyquest);
};

// ---- Static: seed the default user ----------------------------------------

const DEFAULT_DAILY = ["LeetCode", "DSA Revision", "GitHub Commit", "TryHackMe"];
const DEFAULT_BONUS = ["DBMS Revision", "Speech Practice", "Reading", "Type Writing"];
const DEFAULT_WEEKLY = ["Article Writing", "LinkedIn Post"];

// Creates the single default user document if the "users" collection is
// empty. Safe to call on every server start — it's a no-op if a user
// already exists.
userSchema.statics.seedDefaultUser = async function () {
  const existingUser = await this.findOne();
  if (existingUser) return existingUser;

  const newUser = await this.create({
    username: "Hunter",
    dailyquest: DEFAULT_DAILY.map((mission) => ({ mission, done: false })),
    bonusquest: DEFAULT_BONUS.map((mission) => ({ mission, done: false })),
    weeklyquest: DEFAULT_WEEKLY.map((mission) => ({ mission, done: false })),
    dailyprogress: 0,
    bonusprogress: 0,
    weeklyprogress: 0,
    penalty: 0,
    compensate: [],
    todoList: [],
  });

  console.log("Seeded default user into SoloLevelingUsers.users");
  return newUser;
};

module.exports = mongoose.model("User", userSchema);
