// models/Portfolio.js
// Describes what a "portfolio" document looks like in the database.
// A portfolio belongs to one user and is made up of several sections.

const mongoose = require("mongoose");

// Small reusable sub-schemas for each section of the portfolio.
// "_id: false" keeps things simple for beginners (no extra ids inside arrays).

const projectSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    link: String,
    image: String,
  },
  { _id: false }
);

const educationSchema = new mongoose.Schema(
  {
    school: String,
    degree: String,
    year: String,
  },
  { _id: false }
);

const experienceSchema = new mongoose.Schema(
  {
    company: String,
    role: String,
    duration: String,
    description: String,
  },
  { _id: false }
);

const certificateSchema = new mongoose.Schema(
  {
    title: String,
    issuer: String,
    year: String,
  },
  { _id: false }
);

const portfolioSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Personal info section
    fullName: { type: String, default: "" },
    title: { type: String, default: "" }, // e.g. "Frontend Developer"
    bio: { type: String, default: "" },
    profileImage: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    location: { type: String, default: "" },

    // Content sections
    skills: { type: [String], default: [] },
    projects: { type: [projectSchema], default: [] },
    education: { type: [educationSchema], default: [] },
    experience: { type: [experienceSchema], default: [] },
    certificates: { type: [certificateSchema], default: [] },

    // Order in which sections should appear (drag-and-drop result)
    sectionOrder: {
      type: [String],
      default: ["about", "skills", "projects", "experience", "education", "certificates", "contact"],
    },

    // Look & feel
    template: {
      type: String,
      enum: ["modern", "minimal", "creative"],
      default: "modern",
    },
    theme: {
      type: String,
      enum: ["light", "dark"],
      default: "light",
    },

    // Publishing
    isPublic: { type: Boolean, default: false },
    slug: { type: String, unique: true, sparse: true }, // used for the public share link
    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Portfolio", portfolioSchema);
