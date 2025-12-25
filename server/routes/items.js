const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

// Get all items
router.get('/', async (req, res) => {
  try {
    const items = await Item.find().populate('medium').sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single item
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('medium');
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get items by medium
router.get('/medium/:mediumId', async (req, res) => {
  try {
    const items = await Item.find({ medium: req.params.mediumId })
      .populate('medium')
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get wishlist items by medium
router.get('/wishlist/medium/:mediumId', async (req, res) => {
  try {
    const items = await Item.find({ medium: req.params.mediumId, isWishlist: true })
      .populate('medium')
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all wishlist items
router.get('/wishlist/all', async (req, res) => {
  try {
    const items = await Item.find({ isWishlist: true })
      .populate('medium')
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create item
router.post('/', async (req, res) => {
  const item = new Item({
    title: req.body.title,
    creator: req.body.creator,
    imageUrl: req.body.imageUrl,
    rating: req.body.rating || 0,
    description: req.body.description,
    medium: req.body.medium,
    isWishlist: req.body.isWishlist || false
  });

  try {
    const newItem = await item.save();
    const populatedItem = await Item.findById(newItem._id).populate('medium');
    res.status(201).json(populatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update item
router.patch('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (req.body.title) item.title = req.body.title;
    if (req.body.creator) item.creator = req.body.creator;
    if (req.body.imageUrl) item.imageUrl = req.body.imageUrl;
    if (req.body.rating !== undefined) item.rating = req.body.rating;
    if (req.body.description) item.description = req.body.description;
    if (req.body.medium) item.medium = req.body.medium;
    if (req.body.isWishlist !== undefined) item.isWishlist = req.body.isWishlist;

    const updatedItem = await item.save();
    const populatedItem = await Item.findById(updatedItem._id).populate('medium');
    res.json(populatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete item
router.delete('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    await item.deleteOne();
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;