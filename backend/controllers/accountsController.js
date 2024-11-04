// controllers/accountsController.js

const Account = require("../models/account");

// Get all income or expense entries
exports.getAccounts = async (req, res) => {
  const { type } = req.query;
  try {
    const accounts = await Account.find(type ? { type } : {});
    res.status(200).json(accounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a new income or expense entry
exports.addAccount = async (req, res) => {
  try {
    const newAccount = new Account(req.body);
    await newAccount.save();
    res.status(201).json(newAccount);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update an income or expense entry
exports.updateAccount = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedAccount = await Account.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updatedAccount);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete an income or expense entry
exports.deleteAccount = async (req, res) => {
  const { id } = req.params;
  try {
    await Account.findByIdAndDelete(id);
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
