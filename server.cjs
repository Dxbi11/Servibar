const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
require('dotenv').config();

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json()); // For parsing application/json

// Routes
app.get('/hotels', async (req, res) => {
  try {
    const hotels = await prisma.hotel.findMany();
    res.json(hotels);
  } catch (error) {
    console.error('Error fetching hotels:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/hotels', async (req, res) => {
  const { name, address } = req.body;
  try {
    const newHotel = await prisma.hotel.create({
      data: {
        name,
      },
    });
    res.status(201).json(newHotel);
  } catch (error) {
    console.error('Error adding hotel:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
