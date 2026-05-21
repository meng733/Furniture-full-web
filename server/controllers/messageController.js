const Message = require('../models/Message');

// @desc    Send contact message
// @route   POST /api/messages
// @access  Public
exports.sendMessage = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    const newMessage = await Message.create({
      name,
      email,
      phone,
      subject,
      message
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: newMessage
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all messages
// @route   GET /api/messages
// @access  Private/Admin
exports.getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find().sort('-createdAt');
    res.status(200).json({
      success: true,
      count: messages.length,
      messages
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark message as read
// @route   PUT /api/messages/:id/read
// @access  Private/Admin
exports.markAsRead = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    message.read = true;
    await message.save();

    res.status(200).json({
      success: true,
      message
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Private/Admin
exports.deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    await message.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
