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

// Search items across all mediums
router.get('/search', async (req, res) => {
  try {
    const { 
      query = '', 
      ratingMin = 0, 
      ratingMax = 5, 
      dateFilter = 'all',
      sortBy = 'newest' 
    } = req.query;
    
    // Build search filter
    const searchFilter = {};
    
    if (query) {
      searchFilter.$or = [
        { title: { $regex: query, $options: 'i' } },
        { creator: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ];
    }

    // Add rating filter
    searchFilter.rating = { $gte: parseFloat(ratingMin), $lte: parseFloat(ratingMax) };

    // Add date filter
    const now = new Date();
    if (dateFilter !== 'all') {
      let startDate;
      switch (dateFilter) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          startDate = null;
      }
      if (startDate) {
        searchFilter.createdAt = { $gte: startDate };
      }
    }

    // Build sort
    let sortCriteria = { createdAt: -1 };
    switch (sortBy) {
      case 'oldest':
        sortCriteria = { createdAt: 1 };
        break;
      case 'rating-high':
        sortCriteria = { rating: -1, createdAt: -1 };
        break;
      case 'rating-low':
        sortCriteria = { rating: 1, createdAt: -1 };
        break;
      case 'name':
        sortCriteria = { title: 1 };
        break;
      case 'newest':
      default:
        sortCriteria = { createdAt: -1 };
    }

    const items = await Item.find(searchFilter)
      .populate('medium')
      .sort(sortCriteria);
    
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

// Get consumed items by medium
router.get('/consumed/medium/:mediumId', async (req, res) => {
  try {
    const items = await Item.find({ medium: req.params.mediumId, isConsumed: true })
      .populate('medium')
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all consumed items
router.get('/consumed/all', async (req, res) => {
  try {
    const items = await Item.find({ isConsumed: true })
      .populate('medium')
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get in progress items by medium
router.get('/inprogress/medium/:mediumId', async (req, res) => {
  try {
    const items = await Item.find({ medium: req.params.mediumId, isInProgress: true })
      .populate('medium')
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all in progress items
router.get('/inprogress/all', async (req, res) => {
  try {
    const items = await Item.find({ isInProgress: true })
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
    isWishlist: req.body.isWishlist || false,
    isLiked: req.body.isLiked || false,
    isConsumed: req.body.isConsumed || false,
    isInProgress: req.body.isInProgress || false
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
    if (req.body.isLiked !== undefined) item.isLiked = req.body.isLiked;
    if (req.body.isConsumed !== undefined) item.isConsumed = req.body.isConsumed;
    if (req.body.isInProgress !== undefined) item.isInProgress = req.body.isInProgress;

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