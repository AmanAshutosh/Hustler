require("dotenv").config();
const express = require("express");
const cors    = require("cors");
const path    = require("path");
const { authenticate } = require("./middleware/auth");
const db = require("./db/database");

const app = express();
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/auth",     require("./routes/auth"));
app.use("/api/sessions", authenticate, require("./routes/sessions"));
app.use("/api/dsa",      authenticate, require("./routes/dsa"));
app.use("/api/projects", authenticate, require("./routes/projects"));
app.use("/api/stats",    authenticate, require("./routes/stats"));
app.use("/api/subjects", authenticate, require("./routes/subjects"));
app.use("/api/user",     authenticate, require("./routes/user"));
app.use("/api/tracker",  authenticate, require("./routes/tracker"));
app.use("/api/roadmap",  authenticate, require("./routes/roadmap"));

app.get("/api/health", (_, res) => res.json({ ok: true }));

// Serve frontend build
const distPath = path.join(__dirname, "../client/dist");
app.use(express.static(distPath));
app.get("*", (req, res) => res.sendFile(path.join(distPath, "index.html")));

const PORT = process.env.PORT || 3001;

// Wait for MongoDB to connect and restore state before accepting requests
db.ready.then(() => {
  app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
});
