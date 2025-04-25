const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewSchema = new Schema({
  rating: { type: Number, required: true, min: 1, max: 5 },
  text: String,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Review", reviewSchema);
