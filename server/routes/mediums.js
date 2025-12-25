const express = require('express');
const router = express.Router();
const Medium = require('../models/Medium');

// Get all mediums
router.get('/', async (req, res) => {
  try {
    const mediums = await Medium.find().sort({ createdAt: -1 });
    res.json(mediums);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single medium
router.get('/:id', async (req, res) => {
  try {
    const medium = await Medium.findById(req.params.id);
    if (!medium) {
      return res.status(404).json({ message: 'Medium not found' });
    }
    res.json(medium);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create medium
router.post('/', async (req, res) => {
  const medium = new Medium({
    title: req.body.title,
    description: req.body.description,
    imageUrl: req.body.imageUrl
  });

  try {
    const newMedium = await medium.save();
    res.status(201).json(newMedium);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update medium
router.patch('/:id', async (req, res) => {
  try {
    const medium = await Medium.findById(req.params.id);
    if (!medium) {
      return res.status(404).json({ message: 'Medium not found' });
    }

    if (req.body.title) medium.title = req.body.title;
    if (req.body.description) medium.description = req.body.description;
    if (req.body.imageUrl) medium.imageUrl = req.body.imageUrl;

    const updatedMedium = await medium.save();
    res.json(updatedMedium);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete medium
router.delete('/:id', async (req, res) => {
  try {
    const medium = await Medium.findById(req.params.id);
    if (!medium) {
      return res.status(404).json({ message: 'Medium not found' });
    }
    await medium.deleteOne();
    res.json({ message: 'Medium deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;