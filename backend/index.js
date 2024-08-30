const express = require('express');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/UserRoutes');
const adminRoutes = require('./routes/AdminRoutes');

const app = express();

app.use(cors());
app.use(express.json());


// DB Connection
const connectDB = require('./db');
connectDB();

// Basic route
app.get("/", (req, res) => {
    res.send("Welcome to Sports-Buddy-Backend");
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);


// Start server
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
