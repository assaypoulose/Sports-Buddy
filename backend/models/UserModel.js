const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    sports: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sport' }], // References to sports they are interested in
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }], // References to events they have created or joined
    role: { type: String, enum: ['user', 'admin'], default: 'user' }, // Role to distinguish between user and admin
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
