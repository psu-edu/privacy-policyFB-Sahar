const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const User = require('./models/User'); // Import the User model

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json()); // To parse incoming JSON requests
app.use(cors()); // Enable Cross-Origin Resource Sharing

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI) // Use the MONGO_URI from the .env file
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.post('/api/auth/facebook', async (req, res) => {
  const { facebookId, name, email } = req.body;

  // Validate the request body
  if (!facebookId || !name || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Check if the user already exists
    let user = await User.findOne({ facebookId });

    if (!user) {
      // If the user doesn't exist, create a new one
      user = new User({ facebookId, name, email });
      await user.save();
    }

    // Send a success response with the user data
    res.status(200).json({ message: 'User logged in successfully', user });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));