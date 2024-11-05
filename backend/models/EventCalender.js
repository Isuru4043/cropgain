const mongoose = require("mongoose");

// Define Event schema
const EventSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  events: [
    {
      name: {
        type: String,
        required: true,
      },
      time: {
        type: Date,
        required: true,
      },
    },
  ],
});

// Export Event model
module.exports = mongoose.model("Event", EventSchema);
