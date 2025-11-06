const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all origins (optional now, since frontend is same-origin)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Serve static files from /public
app.use(express.static("public"));

// Middleware to parse JSON
app.use(express.json());

// Load tanks from JSON file
const loadTanks = () => {
  const data = fs.readFileSync(path.join(__dirname, "tanks.json"), "utf8");
  return JSON.parse(data);
};

let TANKS = loadTanks();

// ➤ NEW: Serve the demo UI at /demo
app.get("/demo", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "demo.html"));
});

app.get('/exam', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'exam.html'))
})

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Tanks API!",
    endpoints: {
      "GET /tanks": "Returns all tanks",
      "GET /tanks?search=<term>": "Search tanks by name, country, or era",
      "GET /demo": "View interactive tank browser UI",
      "GET /exam": "View exam demo for advanced students",
    },
  });
});

// GET /tanks — with optional search
app.get("/tanks", (req, res) => {
  const { search } = req.query;

  if (!search) {
    return res.json(TANKS);
  }

  const term = search.toLowerCase().trim();

  const filtered = TANKS.filter(
    (tank) =>
      tank.name.toLowerCase().includes(term) ||
      tank.country.toLowerCase().includes(term) ||
      tank.era.toLowerCase().includes(term)
  );

  res.json(filtered);
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Tanks Fullstack App running on http://localhost:${PORT}`);
  console.log(`👉 View UI at: http://localhost:${PORT}/demo`);
});
