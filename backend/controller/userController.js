const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
const Event = require('../models/EventModel');


// User Registration
exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({ username, email, password: hashedPassword });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// User Login
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, userId: user._id });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Create a new Event
exports.createEvent = async (req, res) => {
    const { sport, location, time, description } = req.body;

    // Check if location is provided and is an object
    if (!location || typeof location !== 'object') {
        return res.status(400).json({ message: 'Invalid location data provided' });
    }

    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newEvent = new Event({
            sport,
            location: {
                country: location.country,
                city: location.city
            },
            time,
            description,
            createdBy: req.user._id
        });

        await newEvent.save();

        // Add the event to the user's list of events
        user.events.push(newEvent._id);
        await user.save();

        res.status(201).json(newEvent);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};


// Get all events for the user
exports.getUserEvents = async (req, res) => {
    try {
        // Fetch events created by the logged-in user
        const events = await Event.find({ createdBy: req.user._id })
            .populate('sport') // Populate sport details if needed
            .exec(); // Ensure the query is executed

        if (!events.length) {
            return res.status(404).json({ message: 'No events found for this user' });
        }

        res.json(events);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Update or Delete a Sport Event by User
exports.updateEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (event.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        // Handle updates specifically for the event schema
        const { sport, location, time, description } = req.body;

        if (sport) event.sport = sport;
        if (location) {
            event.location.country = location.country;
            event.location.city = location.city;
        }
        if (time) event.time = time;
        if (description) event.description = description;

        await event.save();
        res.json(event);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};


//Delete event
exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (event.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        // Replace `remove()` with `deleteOne()`
        await event.deleteOne();
        res.json({ message: 'Event removed' });
    } catch (err) {
        console.error(`Failed to delete event with ID ${req.params.id}:`, err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};


