const express = require('express');
const router = express.Router();
const { signup, login, getMe } = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { User } = require('../models');

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', verifyToken, getMe);

// Get all users (for adding members)
router.get('/users', verifyToken, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role'],
    });
    return res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
});

module.exports = router;