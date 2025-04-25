// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const Review = require("./review.js"); // your Mongoose model

const app = express();

// ———— REQUIRED ENV VARS ————
const { PORT, MONGO_URI } = process.env;
if (!PORT || !MONGO_URI) {
  console.error("❌ Missing required env vars. Ensure PORT and MONGO_URI are set.");
  process.exit(1);
}

// ———— CONNECT TO MONGODB ATLAS ————
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// ———— MIDDLEWARE ————
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// ———— API ENDPOINTS ————
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

// ———— START SERVER ————
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
