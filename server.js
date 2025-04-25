// server.js
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const Review = require("./review.js"); // your mongoose model

const app = express();
const PORT = 3000;

// 1) Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/reviewDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error(err));

// 2) Middleware
app.use(cors());
app.use(bodyParser.json());

// 3) Serve static files (all HTML/CSS/JS in this folder)
app.use(express.static(__dirname));

// 4) Send index.html on root request
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// 5) API endpoints
app.get("/api/reviews", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ date: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Failed to load reviews" });
  }
});

app.post("/api/reviews", async (req, res) => {
  try {
    const { rating, text } = req.body;
    const newReview = new Review({ rating, text });
    await newReview.save();
    res.status(201).json(newReview);
  } catch (err) {
    res.status(500).json({ error: "Failed to save review" });
  }
});

// 6) Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
