const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  epfNumber: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  role: { type: String, required: true },
  skills: { type: [String], required: true },
  dateJoined: { type: Date, required: true },
  contactNumber: { type: String, required: true },
  email: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Worker', workerSchema);