const Product = require('../models/Product');
const Review = require('../models/Review');
const { uploadImage } = require('../config/cloudinary');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    const { search, category, minPrice, maxPrice, sort, page = 1, limit = 9 } = req.query;

    const query = {};

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Price filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Sorting
    let sortBy = '-createdAt';
    if (sort) {
      if (sort === 'price-asc') sortBy = 'price';
      if (sort === 'price-desc') sortBy = '-price';
      if (sort === 'rating') sortBy = '-ratings';
      if (sort === 'oldest') sortBy = 'createdAt';
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortBy)
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: products.length,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit))
      },
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Get reviews associated with this product
    const reviews = await Review.find({ product: req.params.id }).sort('-createdAt');

    res.status(200).json({
      success: true,
      product,
      reviews
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res, next) => {
  try {
    const { name, price, description, category, stock, featured, dimensions, materials } = req.body;
    
    let imageUrls = [];

    // Handle files if uploaded
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploadResult = await uploadImage(file.path);
        if (uploadResult) {
          imageUrls.push(uploadResult.url);
        }
      }
    } else if (req.body.images) {
      // Allow passing URLs as fallback
      imageUrls = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    }

    // If no images are uploaded/provided, use a default image placeholder
    if (imageUrls.length === 0) {
      imageUrls.push('/uploads/default-furniture.jpg');
    }

    const product = await Product.create({
      name,
      price: Number(price),
      description,
      category,
      stock: stock ? Number(stock) : 10,
      featured: featured === 'true' || featured === true,
      dimensions: dimensions || 'N/A',
      materials: materials || 'N/A',
      images: imageUrls
    });

    res.status(201).json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    let imageUrls = product.images;

    // Handle files if uploaded
    if (req.files && req.files.length > 0) {
      const newUrls = [];
      for (const file of req.files) {
        const uploadResult = await uploadImage(file.path);
        if (uploadResult) {
          newUrls.push(uploadResult.url);
        }
      }
      // If we uploaded new images, we replace or append. Let's replace.
      imageUrls = newUrls;
    } else if (req.body.images) {
      imageUrls = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    }

    const updateData = { ...req.body };
    if (req.files && req.files.length > 0) {
      updateData.images = imageUrls;
    }
    if (updateData.price) updateData.price = Number(updateData.price);
    if (updateData.stock) updateData.stock = Number(updateData.stock);
    if (updateData.featured) updateData.featured = updateData.featured === 'true' || updateData.featured === true;

    product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await product.deleteOne();

    // Clean up related reviews
    await Review.deleteMany({ product: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Product and related reviews deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add review
// @route   POST /api/products/:id/reviews
// @access  Public (or Private)
exports.createProductReview = async (req, res, next) => {
  try {
    const { name, rating, comment } = req.body;
    const productId = req.params.id;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const review = await Review.create({
      product: productId,
      name: name || 'Anonymous',
      rating: Number(rating),
      comment
    });

    // Recalculate average ratings
    const reviews = await Review.find({ product: productId });
    const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
    
    product.ratings = Number(avgRating.toFixed(1));
    await product.save();

    res.status(201).json({
      success: true,
      review,
      productRatings: product.ratings
    });
  } catch (error) {
    next(error);
  }
};
