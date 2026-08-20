// middleware/auth.js
// Protects routes by checking for a valid login token (JWT).
// The frontend sends the token in the "Authorization" header like:
//   Authorization: Bearer <token>

const jwt = require("jsonwebtoken");

function protect(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized. Please log in." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // attach the logged-in user's id to the request
    next();
  } catch (error) {
    return res.status(401).json({ message: "Session expired or invalid. Please log in again." });
  }
}

module.exports = protect;
