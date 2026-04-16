const jwt = require("jsonwebtoken");

// Load secret from .env.
// We keep a fallback ONLY for local development to prevent crashes.
const JWT_SECRET = process.env.JWT_SECRET || "dev_fallback_secret_123";

function authenticate(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  const token = header.split(" ")[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    // Attach the userId to the request object so routes can use it
    req.userId = payload.userId;
    next();
  } catch (error) {
    // Differentiation between expired and just plain "bad" tokens is helpful for debugging
    const message =
      error.name === "TokenExpiredError" ? "Token expired" : "Invalid token";

    res.status(401).json({ error: message });
  }
}

// Exporting both the function and the secret
// (Your auth routes will need this secret to sign tokens)
module.exports = { authenticate, JWT_SECRET };
