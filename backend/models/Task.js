const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: String,
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker' },
  dueDate: Date,
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'] },
});

module.exports = mongoose.model('Task', taskSchema);