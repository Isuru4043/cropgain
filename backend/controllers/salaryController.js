const Salary = require('../models/Salary');

exports.getSalaries = async (req, res) => {
  const salaries = await Salary.find().populate('workerId');
  res.json(salaries);
};

exports.addSalary = async (req, res) => {
  const newSalary = new Salary(req.body);
  await newSalary.save();
  res.status(201).json(newSalary);
};

exports.updateSalary = async (req, res) => {
  const updatedSalary = await Salary.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedSalary);
};

exports.deleteSalary = async (req, res) => {
  await Salary.findByIdAndDelete(req.params.id);
  res.status(204).end();
};
