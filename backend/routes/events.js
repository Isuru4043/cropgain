// routes/events.js

const express = require("express");
const {
  getEventsByDate,
  addEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventsController");

const router = express.Router();

router.get("/", getEventsByDate); // GET /api/events?date=YYYY-MM-DD
router.post("/", addEvent); // POST /api/events
router.put("/:id", updateEvent); // PUT /api/events/:id
router.delete("/:id", deleteEvent); // DELETE /api/events/:id

module.exports = router;
