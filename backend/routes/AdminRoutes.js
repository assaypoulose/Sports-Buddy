const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const {
    registerAdmin,
    adminLogin,
    getSports, 
    addSportCategory,
    updateSportCategory,
    deleteSportCategory,
    getLocations,  
    addOrUpdateLocation,
    updateLocation,
    deleteLocation  
} = require('../controller/adminController');

const router = express.Router();

// Register Admin
router.post("/register", registerAdmin);

// Admin Login
router.post("/login", adminLogin);

// Routes for Sport Category
router.post('/sports', [authMiddleware, adminMiddleware], addSportCategory);
router.get('/sports', [authMiddleware, adminMiddleware], getSports); // Get all sports categories
router.put('/sports/:id', [authMiddleware, adminMiddleware], updateSportCategory);
router.delete('/sports/:id', [authMiddleware, adminMiddleware], deleteSportCategory);

// Routes for Location Management
router.post('/locations', [authMiddleware, adminMiddleware], addOrUpdateLocation);
router.get('/locations', [authMiddleware, adminMiddleware], getLocations); // Get all locations
router.put('/locations/:id', [authMiddleware, adminMiddleware], updateLocation);
router.delete('/locations/:id', [authMiddleware, adminMiddleware], deleteLocation); // Delete a location


module.exports = router;
