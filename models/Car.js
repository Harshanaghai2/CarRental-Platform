const mongoose = require("mongoose")

const carSchema = new mongoose.Schema({
  model: { type: String, required: true },
  type: { type: String },
  pricePerDay: { type: Number, default: 0 },
  availability: {
    type: Boolean,
    default: true,
  },
  location: { type: String, default: "" },
  image: { type: String, default: "/car-placeholder.jpg" },
});

module.exports = mongoose.model('Car',carSchema)