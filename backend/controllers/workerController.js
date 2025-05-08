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
      skills: skills.split(',').map(skill => skill.trim()), // Convert comma-separated string to array
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