const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
    registerUser,
    loginUser,
    createEvent,
    updateEvent,
    deleteEvent,
    getUserEvents
} = require('../controller/userController');

const router = express.Router();

// User Registration
router.post('/register', registerUser);

// User Login
router.post('/login', loginUser);

// Get all events for the user
router.get('/events', authMiddleware, getUserEvents);



// Create a new Event
router.post('/events', authMiddleware, createEvent);

// Update a Sport Event by User
router.put('/events/:id', authMiddleware, updateEvent);

// Delete a Sport Event by User
router.delete('/events/:id', authMiddleware, deleteEvent);

module.exports = router;
