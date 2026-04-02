const express = require('express');
const router = express.Router();
const Savings = require('../models/Savings');

router.get('/', async (req, res) => {
  try {
    const savings = await Savings.find().sort({ date: -1 });
    res.json(savings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const savings = new Savings(req.body);
    const savedSavings = await savings.save();
    res.status(201).json(savedSavings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;