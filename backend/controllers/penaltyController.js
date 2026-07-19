// GET /api/penalty
// Returns current penalty count plus the compensation history
const getPenalty = async (req, res) => {
  try {
    const user = req.currentUser;
    res.status(200).json({ penalty: user.penalty, compensate: user.compensate });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch penalty", error: error.message });
  }
};

// POST /api/compensate
// Body: { description }
// Logs a compensation entry (with a server-generated date) and reduces
// penalty by 1, never below zero. Only meaningful when penalty > 0, but we
// still guard against negative values defensively.
const compensate = async (req, res) => {
  try {
    const { description } = req.body;

    if (!description || !description.trim()) {
      return res.status(400).json({ message: "Description is required" });
    }

    const user = req.currentUser;

    if (user.penalty <= 0) {
      return res.status(400).json({ message: "No penalty to compensate for" });
    }

    user.compensate.push({
      date: new Date().toISOString(),
      description,
    });

    user.penalty = Math.max(0, user.penalty - 1);

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to compensate penalty", error: error.message });
  }
};

module.exports = { getPenalty, compensate };
