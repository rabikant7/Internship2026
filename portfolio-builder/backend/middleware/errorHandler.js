// middleware/errorHandler.js
// Central place for handling "route not found" and unexpected errors,
// so every controller doesn't need to repeat this logic.

function notFound(req, res, next) {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
}

function errorHandler(err, req, res, next) {
  console.error("🔥 Error:", err.message);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message || "Something went wrong on the server.",
  });
}

module.exports = { notFound, errorHandler };
