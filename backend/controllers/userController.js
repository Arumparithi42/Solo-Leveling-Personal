// GET /api/user
// Returns the complete user document (quests, progress, penalty, todos, etc.)
const getUser = async (req, res) => {
  try {
    // req.currentUser was resolved by the attachCurrentUser middleware
    res.status(200).json(req.currentUser);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user", error: error.message });
  }
};

module.exports = { getUser };
