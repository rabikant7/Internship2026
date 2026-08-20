// controllers/portfolioController.js
// Handles creating, reading, updating and deleting portfolios,
// plus the public gallery listing.

const Portfolio = require("../models/Portfolio");

// Turns "Ram Kumar" into a URL-friendly, unique-ish slug like "ram-kumar-x7f2"
function makeSlug(name) {
  const base = (name || "portfolio")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const randomBit = Math.random().toString(36).slice(2, 6);
  return `${base}-${randomBit}`;
}

// @route  POST /api/portfolio
// Creates a new portfolio for the logged-in user
async function createPortfolio(req, res) {
  try {
    // A user can have one main portfolio in this beginner-friendly version
    const existing = await Portfolio.findOne({ user: req.userId });
    if (existing) {
      return res.status(400).json({ message: "You already have a portfolio. Edit it instead of creating a new one." });
    }

    const portfolio = await Portfolio.create({
      user: req.userId,
      fullName: req.body.fullName || "",
      title: req.body.title || "",
      slug: makeSlug(req.body.fullName),
    });

    res.status(201).json({ message: "Portfolio created!", portfolio });
  } catch (error) {
    res.status(500).json({ message: "Could not create portfolio.", error: error.message });
  }
}

// @route  GET /api/portfolio
// Gets the logged-in user's own portfolio
async function getMyPortfolio(req, res) {
  try {
    const portfolio = await Portfolio.findOne({ user: req.userId });
    if (!portfolio) {
      return res.status(404).json({ message: "No portfolio found yet. Create one first." });
    }
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ message: "Could not load portfolio.", error: error.message });
  }
}

// @route  GET /api/portfolio/public/:slug
// Anyone can view a public portfolio using its share link — no login required
async function getPublicPortfolio(req, res) {
  try {
    const portfolio = await Portfolio.findOne({ slug: req.params.slug, isPublic: true });
    if (!portfolio) {
      return res.status(404).json({ message: "This portfolio is not available or is private." });
    }
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ message: "Could not load portfolio.", error: error.message });
  }
}

// @route  PUT /api/portfolio/:id
// Updates any section of the portfolio (personal info, skills, projects, etc.)
async function updatePortfolio(req, res) {
  try {
    const portfolio = await Portfolio.findById(req.params.id);

    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found." });
    }

    // Make sure users can only edit their own portfolio
    if (portfolio.user.toString() !== req.userId) {
      return res.status(403).json({ message: "You are not allowed to edit this portfolio." });
    }

    // Allow updating any of these known fields if they were sent
    const editableFields = [
      "fullName", "title", "bio", "email", "phone", "location",
      "skills", "projects", "education", "experience", "certificates",
      "sectionOrder", "template", "theme", "isPublic",
    ];

   const arrayFields = [
  "skills",
  "projects",
  "education",
  "experience",
  "certificates",
  "sectionOrder",
];

editableFields.forEach((field) => {
  if (req.body[field] !== undefined) {
    let value = req.body[field];

    // FormData sends array/object fields as JSON strings.
    if (arrayFields.includes(field) && typeof value === "string") {
      try {
        value = JSON.parse(value);
      } catch (error) {
        return res.status(400).json({
          message: `Invalid data format for ${field}.`,
        });
      }
    }

    portfolio[field] = value;
  }
});

    // If a new profile photo was uploaded
    if (req.file) {
      portfolio.profileImage = `/uploads/${req.file.filename}`;
    }

    await portfolio.save();
    res.json({ message: "Portfolio updated!", portfolio });
  } catch (error) {
    res.status(500).json({ message: "Could not update portfolio.", error: error.message });
  }
}

// @route  DELETE /api/portfolio/:id
async function deletePortfolio(req, res) {
  try {
    const portfolio = await Portfolio.findById(req.params.id);

    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found." });
    }
    if (portfolio.user.toString() !== req.userId) {
      return res.status(403).json({ message: "You are not allowed to delete this portfolio." });
    }

    await portfolio.deleteOne();
    res.json({ message: "Portfolio deleted." });
  } catch (error) {
    res.status(500).json({ message: "Could not delete portfolio.", error: error.message });
  }
}

// @route  GET /api/gallery
// Lists all public portfolios, with optional search and profession filter
async function getGallery(req, res) {
  try {
    const { search, profession } = req.query;

    const query = { isPublic: true };

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { title: { $regex: search, $options: "i" } },
      ];
    }

    if (profession) {
      query.title = { $regex: profession, $options: "i" };
    }

    const portfolios = await Portfolio.find(query)
      .select("fullName title profileImage slug template likes")
      .sort({ createdAt: -1 });

    res.json(portfolios);
  } catch (error) {
    res.status(500).json({ message: "Could not load gallery.", error: error.message });
  }
}

// @route  PUT /api/gallery/:slug/like
// Simple like counter for public portfolios (optional feature)
async function likePortfolio(req, res) {
  try {
    const portfolio = await Portfolio.findOneAndUpdate(
      { slug: req.params.slug, isPublic: true },
      { $inc: { likes: 1 } },
      { new: true }
    );
    if (!portfolio) return res.status(404).json({ message: "Portfolio not found." });
    res.json({ likes: portfolio.likes });
  } catch (error) {
    res.status(500).json({ message: "Could not like portfolio.", error: error.message });
  }
}

module.exports = {
  createPortfolio,
  getMyPortfolio,
  getPublicPortfolio,
  updatePortfolio,
  deletePortfolio,
  getGallery,
  likePortfolio,
};
