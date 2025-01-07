const express = require("express");
const router = express.Router();
const FertilizerTask = require("../models/FertilizerTask");

// Create a new fertilizer task
router.post("/", async (req, res) => {
  try {
    const task = new FertilizerTask(req.body);
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all fertilizer tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await FertilizerTask.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a task
router.put("/:id", async (req, res) => {
  try {
    const updatedTask = await FertilizerTask.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a task
router.delete("/:id", async (req, res) => {
  try {
    await FertilizerTask.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
