const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    // If we're in test environment, skip the actual connection as it's handled by mongodb-memory-server
    if (process.env.NODE_ENV === "test") {
      return;
    }

    const conn = await mongoose.connect(process.env.DB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    // Only exit in non-test environment
    if (process.env.NODE_ENV !== "test") {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
