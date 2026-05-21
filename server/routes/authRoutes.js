const express = require('express');
const router = express.Router();
const { register, login, getMe, getUsers } = require('../controllers/authController');
const { protect, admin } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/users', protect, admin, getUsers);

module.exports = router;
