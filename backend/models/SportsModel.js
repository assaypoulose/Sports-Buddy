const mongoose = require('mongoose');

const sportSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // Name of the sport (e.g., soccer, basketball)
    description: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Sport', sportSchema);
