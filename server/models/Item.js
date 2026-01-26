const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  creator: {
    type: String,
    required: true,
    trim: true
  },
  imageUrl: {
    type: String,
    required: true,
    trim: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  medium: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medium',
    required: true
  },
  isWishlist: {
    type: Boolean,
    default: false
  },
  isLiked: {
    type: Boolean,
    default: false
  },
  isConsumed: {
    type: Boolean,
    default: false
  },
  isInProgress: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Item', itemSchema);