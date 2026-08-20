// routes/portfolioRoutes.js
const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const upload = require("../middleware/upload");
const {
  createPortfolio,
  getMyPortfolio,
  getPublicPortfolio,
  updatePortfolio,
  deletePortfolio,
} = require("../controllers/portfolioController");

// Public route (no login required) — order matters, keep this above "/:id"
router.get("/public/:slug", getPublicPortfolio);

// Private routes (login required)
router.post("/", protect, createPortfolio);
router.get("/", protect, getMyPortfolio);
router.put("/:id", protect, upload.single("profileImage"), updatePortfolio);
router.delete("/:id", protect, deletePortfolio);

module.exports = router;
