const Worker = require('../models/Worker');

// Get all workers
exports.getWorkers = async (req, res) => {
  try {
    const workers = await Worker.find();
    res.status(200).json(workers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching workers', error: error.message });
  }
};

// Add a new worker
exports.addWorker = async (req, res) => {
  try {
    const { fullName, epfNumber, age, role, skills, dateJoined, contactNumber, email } = req.body;
    const newWorker = new Worker({
      fullName,
      epfNumber,
      age,
      role,
      skills: Array.isArray(skills) ? skills : skills.split(',').map(skill => skill.trim()),
      dateJoined: new Date(dateJoined),
      contactNumber,
      email,
    });
    await newWorker.save();
    res.status(201).json(newWorker);
  } catch (error) {
    res.status(400).json({ message: 'Error adding worker', error: error.message });
  }
};

// Get recent workers (last 3, sorted by dateJoined)
exports.getRecentWorkers = async (req, res) => {
  try {
    const recentWorkers = await Worker.find()
      .sort({ dateJoined: -1 })
      .limit(3);
    res.status(200).json(recentWorkers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recent workers', error: error.message });
  }
};

// Update a worker
exports.updateWorker = async (req, res) => {
  try {
    const { epfNumber } = req.params;
    const worker = await Worker.findOne({ epfNumber });
    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    const updates = { ...req.body };
    if (updates.skills && !Array.isArray(updates.skills)) {
      updates.skills = updates.skills.split(',').map(skill => skill.trim());
    }
    if (updates.dateJoined) {
      updates.dateJoined = new Date(updates.dateJoined);
    }

    const updatedWorker = await Worker.findOneAndUpdate(
      { epfNumber },
      updates,
      { new: true }
    );
    res.json(updatedWorker);
  } catch (error) {
    res.status(400).json({ message: 'Error updating worker', error: error.message });
  }
};

// Delete a worker
exports.deleteWorker = async (req, res) => {
  try {
    const { epfNumber } = req.params;
    const worker = await Worker.findOne({ epfNumber });
    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    await Worker.findOneAndDelete({ epfNumber });
    res.json({ message: 'Worker deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting worker', error: error.message });
  }
};