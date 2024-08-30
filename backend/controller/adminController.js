const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
const Sport = require('../models/SportsModel');
const Location = require('../models/LocationModel');


// Register Admin
exports.registerAdmin = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if admin already exists
        const adminExists = await User.findOne({ email, role: "admin" });
        if (adminExists) {
            return res.status(400).json({ message: "Admin already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create new admin user
        const newAdmin = new User({
            username,
            email,
            password: hashedPassword,
            role: 'admin'  // Explicitly set the role to 'admin'
        });

        // Save the admin user to the database
        await newAdmin.save();

        // Generate a token
        const token = jwt.sign({ id: newAdmin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Respond with the token and admin ID
        res.status(201).json({ token, adminId: newAdmin._id });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

  
  // Admin Login
  exports.adminLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await User.findOne({ email, role: 'admin' });
        if (!admin) return res.status(400).json({ message: 'Admin not found' });

        const isPasswordCorrect = await bcrypt.compare(password, admin.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, adminId: admin._id });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Add a new Sport Category
exports.addSportCategory = async (req, res) => {
    const { name, description } = req.body;
    try {
        const newSport = new Sport({ name, description });
        await newSport.save();
        res.status(201).json(newSport);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get all Sports Categories
exports.getSports = async (req, res) => {
    try {
        const sports = await Sport.find();
        res.json(sports);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Update a Sport Category
exports.updateSportCategory = async (req, res) => {
    try {
        const sport = await Sport.findById(req.params.id);
        if (!sport) return res.status(404).json({ message: 'Sport not found' });

        Object.assign(sport, req.body);
        await sport.save();
        res.json(sport);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Delete a Sport Category
exports.deleteSportCategory = async (req, res) => {
    try {
        const sport = await Sport.findById(req.params.id);
        if (!sport) return res.status(404).json({ message: 'Sport not found' });

        await sport.remove();
        res.json({ message: 'Sport removed' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Add or Update Location
exports.addOrUpdateLocation = async (req, res) => {
    const { city, area } = req.body;
    try {
        const newLocation = new Location({ city, area });
        await newLocation.save();
        res.status(201).json(newLocation);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get all Locations
exports.getLocations = async (req, res) => {
    try {
        const locations = await Location.find();
        res.json(locations);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Update a Location
exports.updateLocation = async (req, res) => {
    try {
        const location = await Location.findById(req.params.id);
        if (!location) return res.status(404).json({ message: 'Location not found' });

        Object.assign(location, req.body);
        await location.save();
        res.json(location);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Delete a Location
exports.deleteLocation = async (req, res) => {
    try {
        const location = await Location.findById(req.params.id);
        if (!location) return res.status(404).json({ message: 'Location not found' });

        await location.remove();
        res.json({ message: 'Location removed' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};