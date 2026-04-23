const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/users', protect, authorize('admin'), getAllUsers);
router.get('/users/:id', protect, getUserById);
router.put('/users/:id', protect, updateUser);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
