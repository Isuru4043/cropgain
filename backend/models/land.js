// models/land.js
const mongoose = require("mongoose");

const cropSchema = new mongoose.Schema({
  crop: { type: String, required: true },
  area: { type: String, required: true }, // Area in hectares
  plantingDate: { type: Date, required: true },
  harvestDate: { type: Date, required: true },
  numberOfPlants: { type: Number, default: null },
});

const landSchema = new mongoose.Schema({
  section: { type: String, required: true, unique: true }, // E.g., Section A, Section B
  crops: [cropSchema], // Embedded array of crops
});

module.exports = mongoose.model("Land", landSchema);
