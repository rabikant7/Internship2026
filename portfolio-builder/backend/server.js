// server.js
// Entry point of the backend. Sets up Express, connects to MongoDB,
// and wires up all the API routes.

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const galleryRoutes = require("./routes/galleryRoutes");

const app = express();

// --- Middleware ---
app.use(cors());              // allow the frontend to call this API
app.use(express.json());      // parse JSON request bodies

// Serve uploaded profile images statically, e.g. /uploads/12345-photo.png
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Optional: serve the frontend folder directly from this same server,
// so you can run one project without needing a separate frontend server.
app.use(express.static(path.join(__dirname, "..", "frontend")));

// --- API routes ---
app.use("/api/auth", authRoutes);
app.use("/api/profile", userRoutes); // exposes GET/PUT /api/profile
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/gallery", galleryRoutes);

// Simple health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Portfolio Builder API is running." });
});

// --- Error handling (must be last) ---
app.use(notFound);
app.use(errorHandler);

// --- Start server ---
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
});
