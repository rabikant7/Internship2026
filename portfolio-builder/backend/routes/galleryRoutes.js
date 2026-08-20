// routes/galleryRoutes.js
// Public gallery of portfolios — no login required to browse.

const express = require("express");
const router = express.Router();
const { getGallery, likePortfolio } = require("../controllers/portfolioController");

router.get("/", getGallery);
router.put("/:slug/like", likePortfolio);

module.exports = router;
