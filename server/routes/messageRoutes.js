const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getMessages,
  markAsRead,
  deleteMessage
} = require('../controllers/messageController');
const { protect, admin } = require('../middleware/auth');

router.post('/', sendMessage);

// Admin routes
router.get('/', protect, admin, getMessages);
router.put('/:id/read', protect, admin, markAsRead);
router.delete('/:id', protect, admin, deleteMessage);

module.exports = router;
