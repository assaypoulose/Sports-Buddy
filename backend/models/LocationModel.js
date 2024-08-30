// models/Location.js
const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  city: { type: String, required: true },
  area: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Location', locationSchema);
