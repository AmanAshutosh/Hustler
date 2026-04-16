// server/index.js
const express = require("express");
const cors = require("cors");
const { authenticate } = require("./middleware/auth");

// Initialize DB (creates tables if not exist)
require("./db/database");

const app = express();

// FIXED: Added check for environment variable or allow local dev
const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  }),
);

app.use(express.json());

// Public routes
app.use("/api/auth", require("./routes/auth"));

// Protected routes
app.use("/api/sessions", authenticate, require("./routes/sessions"));
app.use("/api/dsa", authenticate, require("./routes/dsa"));
app.use("/api/projects", authenticate, require("./routes/projects"));
app.use("/api/stats", authenticate, require("./routes/stats"));
app.use("/api/user", authenticate, require("./routes/user"));

app.get("/api/health", (_, res) =>
  res.json({ ok: true, time: new Date().toISOString() }),
);

// 404 handler
app.use((req, res) => res.status(404).json({ error: "Route not found" }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong" });
});

// FIXED: Ensure Render's dynamic port is used
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ DevTrack server running at port ${PORT}`);
});
