const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderStatus,
  deleteOrder,
  getDashboardStats
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

// Public or customer order creation
router.post('/', protect, createOrder); // Optional protect, let's keep it protect for general authenticated order but we can fallback if guest
// Let's modify: if auth token header exists, req.user will be populated, but we can make protect optional.
// Let's keep it simple: we can allow creating orders by passing a middleware that populates user if present.
// For now, let's allow public orders (anyone can purchase/order on WhatsApp/submit order details). So no protect here.
router.post('/public', createOrder);

// User specific order viewing (requires login)
router.get('/myorders', protect, getMyOrders);

// Admin Analytics (must be before /:id route)
router.get('/stats/dashboard', protect, admin, getDashboardStats);

// Admin general management
router.get('/', protect, admin, getOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', protect, admin, updateOrderStatus);
router.delete('/:id', protect, admin, deleteOrder);

module.exports = router;
