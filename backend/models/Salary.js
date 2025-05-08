const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker' },
  baseSalary: Number,
  hoursWorked: Number,
  overtime: Number,
  deductions: Number,
  bonuses: Number,
  total: Number,
});

module.exports = mongoose.model('Salary', salarySchema);