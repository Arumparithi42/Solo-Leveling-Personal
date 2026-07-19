const User = require("../models/User");

// There is no authentication yet, so every request operates on the single
// seeded user document. Keeping this logic in one middleware means that
// when real auth is added later (e.g. reading a userId from a JWT), only
// this file needs to change — controllers won't need to know the difference.
const attachCurrentUser = async (req, res, next) => {
  try {
    let user = await User.findOne();

    // Safety net: if the collection was emptied out after server start,
    // reseed instead of erroring.
    if (!user) {
      user = await User.seedDefaultUser();
    }

    req.currentUser = user;
    next();
  } catch (error) {
    res.status(500).json({ message: "Failed to resolve current user", error: error.message });
  }
};

module.exports = attachCurrentUser;
