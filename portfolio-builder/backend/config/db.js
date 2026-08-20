// config/db.js
// Handles the connection to our MongoDB database using Mongoose.

const mongoose = require("mongoose");

async function connectDB() {
  try {
    const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/portfolio_builder";
    await mongoose.connect(uri);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    // Stop the app if we can't connect to the database
    process.exit(1);
  }
}

module.exports = connectDB;
