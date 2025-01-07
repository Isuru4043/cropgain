const mongoose = require("mongoose");

const fertilizerTaskSchema = new mongoose.Schema({
  cropType: {
    type: String,
    required: true,
  },
  fertilizerType: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  method: {
    type: String,
    required: true, // Example: "Broadcasting", "Spraying"
  },
  date: {
    type: Date,
    required: true,
  },
  isRecurring: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("FertilizerTask", fertilizerTaskSchema);
