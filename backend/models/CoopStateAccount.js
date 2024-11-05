const mongoose = require("mongoose");

const AccountSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  previousMonth: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  subTotal: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ["Income", "Expense"],
    required: true,
  },
});

module.exports = mongoose.model("Account", AccountSchema);
