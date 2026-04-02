const express = require('express');
const router = express.Router();
const Repair = require('../models/Repair');

router.get('/', async (req, res) => {
  try {
    const repairs = await Repair.find().sort({ dateReceived: -1 });
    res.json(repairs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const repair = new Repair(req.body);
    const savedRepair = await repair.save();
    res.status(201).json(savedRepair);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { status, dateCompleted } = req.body;
    const updateData = { ...req.body };
    
    if (status === 'Completed' && !dateCompleted) {
      updateData.dateCompleted = new Date();
    }
    
    const repair = await Repair.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!repair) return res.status(404).json({ message: 'Repair not found' });
    res.json(repair);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;