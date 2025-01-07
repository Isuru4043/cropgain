const mongoose = require('mongoose');

const LaborTaskSchema = new mongoose.Schema({
    description: { type: String, required: true },
    assignedTo: { type: String, required: true },
    shift: { type: String, required: true, enum: ['Morning', 'Afternoon', 'Night'] },
    date: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

LaborTaskSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

module.exports = mongoose.model('LaborTask', LaborTaskSchema);


