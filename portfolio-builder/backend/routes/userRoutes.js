// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const upload = require("../middleware/upload");
const { getProfile, updateProfile } = require("../controllers/userController");

// Note: this router is mounted at /api/profile in server.js,
// so these become GET /api/profile and PUT /api/profile
router.get("/", protect, getProfile);
router.put("/", protect, upload.single("profileImage"), updateProfile);

module.exports = router;
