const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const Lead = require('./models/Lead');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Note: To actually store leads, set MONGODB_URI in your .env file
// mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('MongoDB Connected'))
//   .catch(err => console.log(err));

// Routes
app.post('/api/contact', async (req, res) => {
  try {
    const { name, phone, serviceRequested, message } = req.body;
    
    // Create new lead in DB (Commented out to prevent errors if no mongo db is provided)
    // const newLead = new Lead({ name, phone, serviceRequested, message });
    // await newLead.save();

    console.log('Received Lead:', { name, phone, serviceRequested, message });
    
    res.status(200).json({ success: true, message: 'Message received. We will dispatch a technician shortly!' });
  } catch (error) {
    console.error('Error saving lead:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));
