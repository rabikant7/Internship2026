// controllers/userController.js
// Handles reading and updating the logged-in user's profile.

const User = require("../models/User");

// @route  GET /api/profile
async function getProfile(req, res) {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Could not load profile.", error: error.message });
  }
}

// @route  PUT /api/profile
async function updateProfile(req, res) {
  try {
    const { name, profession } = req.body;

    const updates = {};
    if (name) updates.name = name;
    if (profession !== undefined) updates.profession = profession;

    // If a file was uploaded via multer, req.file will exist
    if (req.file) {
      updates.profileImage = `/uploads/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(req.userId, updates, {
      new: true, // return the updated document
      runValidators: true,
    });

    res.json({ message: "Profile updated successfully!", user });
  } catch (error) {
    res.status(500).json({ message: "Could not update profile.", error: error.message });
  }
}

module.exports = { getProfile, updateProfile };
