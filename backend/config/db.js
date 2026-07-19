const mongoose = require("mongoose");

// Connects to MongoDB Atlas using the URI stored in .env
// The database name (SoloLevelingUsers) should already be part of MONGO_URI
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    // Exit the process if we can't connect to the database — nothing else can work without it
    process.exit(1);
  }
};

module.exports = connectDB;
