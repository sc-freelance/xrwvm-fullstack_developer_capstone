const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 3030;

// Middleware
app.use(cors());
app.use(express.json()); // correct JSON body parser

// Load JSON data
const reviews_data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'reviews.json'), 'utf8'));
const dealerships_data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'dealerships.json'), 'utf8'));

// MongoDB connection
mongoose.connect("mongodb://mongo_db:27017/", { dbName: 'dealershipsDB' });

const Reviews = require('./review');
const Dealerships = require('./dealership');

// Seed DB
(async () => {
  try {
    await Reviews.deleteMany({});
    await Reviews.insertMany(reviews_data['reviews']);
    console.log("Reviews seeded");

    await Dealerships.deleteMany({});
    await Dealerships.insertMany(dealerships_data['dealerships']);
    console.log("Dealerships seeded");
  } catch (error) {
    console.error("Error seeding DB:", error);
  }
})();

// Routes
app.get('/', (req, res) => res.send("Welcome to the Mongoose API"));

app.get('/fetchReviews', async (req, res) => {
  try {
    const docs = await Reviews.find();
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching reviews' });
  }
});

app.get('/fetchReviews/dealer/:id', async (req, res) => {
  try {
    const docs = await Reviews.find({ dealership: parseInt(req.params.id) }); // ✅ cast to int
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching dealer reviews' });
  }
});

app.get('/fetchDealers', async (req, res) => {
  try {
    const docs = await Dealerships.find();
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching dealerships' });
  }
});

app.get('/fetchDealers/:state', async (req, res) => {
  try {
    const docs = await Dealerships.find({ state: req.params.state });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching dealerships by state' });
  }
});

app.get('/fetchDealer/:id', async (req, res) => {
  try {
    const doc = await Dealerships.findOne({ id: parseInt(req.params.id) });
    if (doc) res.json(doc);
    else res.status(404).json({ error: 'Dealer not found' });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching dealer' });
  }
});

app.post('/insert_review', async (req, res) => {
  try {
    const data = req.body;
    const docs = await Reviews.find().sort({ id: -1 });
    let new_id = docs.length ? docs[0].id + 1 : 1;

    const review = new Reviews({ id: new_id, ...data });
    const saved = await review.save();
    res.json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error inserting review' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});