const Task = require('../models/Task');

exports.getTasks = async (req, res) => {
  const tasks = await Task.find().populate('assignedTo');
  res.json(tasks);
};

exports.addTask = async (req, res) => {
  const newTask = new Task(req.body);
  await newTask.save();
  res.status(201).json(newTask);
};

exports.updateTask = async (req, res) => {
  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedTask);
};

exports.deleteTask = async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.status(204).end();
};