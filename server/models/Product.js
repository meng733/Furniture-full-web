const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Please add a product price'],
    min: [0, 'Price must be positive']
  },
  description: {
    type: String,
    required: [true, 'Please add a product description']
  },
  category: {
    type: String,
    required: [true, 'Please specify a category'],
    index: true
  },
  images: {
    type: [String],
    default: []
  },
  stock: {
    type: Number,
    required: [true, 'Please specify stock count'],
    default: 10
  },
  featured: {
    type: Boolean,
    default: false
  },
  ratings: {
    type: Number,
    default: 5,
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot be more than 5']
  },
  dimensions: {
    type: String,
    default: 'N/A'
  },
  materials: {
    type: String,
    default: 'N/A'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);
