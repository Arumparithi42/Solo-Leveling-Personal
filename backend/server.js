require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const User = require("./models/User");
const attachCurrentUser = require("./middleware/getCurrentUser");
const startPenaltyCronJobs = require("./cron/penaltyCron");

const userRoutes = require("./routes/userRoutes");
const questRoutes = require("./routes/questRoutes");
const todoRoutes = require("./routes/todoRoutes");
const penaltyRoutes = require("./routes/penaltyRoutes");

const app = express();

// ---- Global middleware ------------------------------------------------
app.use(cors());
app.use(express.json());

// Resolves the single current user for every /api request and attaches it
// as req.currentUser. This keeps controllers auth-agnostic so real
// authentication can be dropped in later without touching route logic.
app.use("/api", attachCurrentUser);

// ---- Routes -------------------------------------------------------------
app.use("/api/user", userRoutes);
app.use("/api", questRoutes); // exposes /api/daily/:id, /api/bonus/:id, /api/weekly/:id
app.use("/api/todo", todoRoutes);
app.use("/api", penaltyRoutes); // exposes /api/penalty and /api/compensate

// Basic health check
app.get("/", (req, res) => {
  res.send("Solo Leveling API is running");
});

// ---- Startup sequence -----------------------------------------------------
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await User.seedDefaultUser(); // creates the default user if the collection is empty
  startPenaltyCronJobs();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
