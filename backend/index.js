require('dotenv').config(); // Load .env variables if needed
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send('Fantasy Football Backend Running!');
});

// Serve static players.json
app.get('/api/players', (req, res) => {
  try {
    const players = require('./data/players.json'); // Static read
    res.json(players);
  } catch (err) {
    console.error('❌ Error loading players.json:', err.message);
    res.status(500).send('Could not load players.json');
  }
});

// Serve static teamData.json
app.get('/api/teams', (req, res) => {
  try {
    const teams = require('./data/teamData.json');
    res.json(teams);
  } catch (err) {
    console.error('❌ Error loading teamData.json:', err.message);
    res.status(500).send('Could not load teamData.json');
  }
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
