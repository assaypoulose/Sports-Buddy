const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    sport: { type: String, required: true }, // Sport name directly as a string
    location: {
        country: { type: String, required: true }, // Country as a string
        city: { type: String, required: true }, // City as a string
    },
    time: { type: Date, required: true }, // Event time
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User who created the event
    description: { type: String, required: true }, // Description of the event
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
