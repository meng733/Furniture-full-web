const Order = require('../models/Order');
const Product = require('../models/Product');
const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
exports.createOrder = async (req, res, next) => {
  try {
    const { customerDetails, orderItems, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items' });
    }

    // Verify stock and update product stock
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        // Decrease stock if stock > 0
        product.stock = Math.max(0, product.stock - item.quantity);
        await product.save();
      }
    }

    const order = await Order.create({
      user: req.user ? req.user.id : null,
      customerDetails,
      orderItems,
      totalPrice
    });

    res.status(201).json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Public
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort('-createdAt');
    res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name email').sort('-createdAt');
    res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
exports.deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    await order.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get admin dashboard statistics
// @route   GET /api/orders/stats/dashboard
// @access  Private/Admin
exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalMessages = await Message.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });

    // Calculate total revenue
    const deliveredOrders = await Order.find({ status: 'Delivered' });
    const totalRevenue = deliveredOrders.reduce((acc, order) => acc + order.totalPrice, 0);

    // Calculate all-time sales regardless of status (for overview)
    const allOrders = await Order.find({});
    const totalSales = allOrders.reduce((acc, order) => acc + order.totalPrice, 0);

    // Get order status summary counts
    const statusCounts = {
      Pending: await Order.countDocuments({ status: 'Pending' }),
      Confirmed: await Order.countDocuments({ status: 'Confirmed' }),
      Processing: await Order.countDocuments({ status: 'Processing' }),
      Delivered: await Order.countDocuments({ status: 'Delivered' }),
      Cancelled: await Order.countDocuments({ status: 'Cancelled' })
    };

    // Latest orders
    const latestOrders = await Order.find({}).sort('-createdAt').limit(5);

    // Latest messages
    const latestMessages = await Message.find({}).sort('-createdAt').limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalOrders,
        totalProducts,
        totalMessages,
        totalCustomers,
        totalRevenue,
        totalSales,
        statusCounts,
        latestOrders,
        latestMessages
      }
    });
  } catch (error) {
    next(error);
  }
};
