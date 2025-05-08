const express = require('express');
const router = express.Router();
const Event = require('../models/Eventmodels'); 
const mongoose = require('mongoose');

// Save events
router.post("/", async (req, res) => {
  const { date, events } = req.body;

  // Input validation
  if (!date || !Array.isArray(events)) {
    return res.status(400).json({ message: "Invalid request body. 'date' and 'events' (array) are required." });
  }

  // Validate time format and format events
  try {
    const formattedEvents = events.map(event => {
      if (!event.name || !event.time) {
        throw new Error('Event name and time are required');
      }

      // Validate time format (HH:mm)
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(event.time)) {
        throw new Error('Invalid time format. Use HH:mm format (24-hour)');
      }

      return {
        name: event.name,
        time: event.time
      };
    });

    // Create and save new event
    const eventData = new Event({ date, events: formattedEvents });
    const savedEvent = await eventData.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get events
router.get("/", async (req, res) => {
  try {
    const { date } = req.query;
    let query = {};
    
    if (date) {
      query.date = date;
    }

    const events = await Event.find(query);
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events", error: error.message });
  }
});

// Update event
router.put("/:id", async (req, res) => {
  try {
    const { events } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { events },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: "Error updating event", error: error.message });
  }
});

// Delete event
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const deletedEvent = await Event.findByIdAndDelete(req.params.id);

    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting event", error: error.message });
  }
});

module.exports = router;
