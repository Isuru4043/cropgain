const express = require('express');
const router = express.Router();
const LaborTask = require('../models/LaborTask');

// Get all labor tasks
router.get('/', async (req, res) => {
    try {
        const tasks = await LaborTask.find().sort({ date: -1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Add a new labor task
router.post('/', async (req, res) => {
    const { description, assignedTo, shift, date } = req.body;

    try {
        const task = new LaborTask({ description, assignedTo, shift, date });
        const savedTask = await task.save();
        res.status(200).json(savedTask);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create task', error: error.message });
    }
});

// Update a labor task
router.put('/:id', async (req, res) => {
    try {
        const updatedTask = await LaborTask.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update task', error: error.message });
    }
});

// Delete a labor task
router.delete('/:id', async (req, res) => {
    try {
        await LaborTask.findByIdAndDelete(req.params.id);
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete task', error: error.message });
    }
});

module.exports = router;
