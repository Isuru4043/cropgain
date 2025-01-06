const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  url: String,
  date: Date,
  cloudinaryId: String
});

const growthMetricsSchema = new mongoose.Schema({
  days: Number,
  height: Number
});

const plantingSchema = new mongoose.Schema({
  cropType: String,
  section: String,
  plantingDate: Date,
  numberOfPlants: Number,
  growthStage: String,
  healthStatus: String,
  photos: [photoSchema],
  growthMetrics: growthMetricsSchema,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const notificationSchema = new mongoose.Schema({
  type: String,
  message: String,
  date: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = {
  Planting: mongoose.model('Planting', plantingSchema),
  Notification: mongoose.model('Notification', notificationSchema)
};