const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

// Import controllers and middleware
const {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  getUsers,
  deactivateUser
} = require('../controllers/authController');

const { protect, authorize } = require('../middleware/auth');

// Validation rules
const registerValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('firstName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name is required and cannot exceed 50 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name is required and cannot exceed 50 characters'),
  body('role')
    .optional()
    .isIn(['admin', 'lawyer', 'paralegal', 'assistant'])
    .withMessage('Invalid role specified')
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const updateProfileValidation = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name cannot exceed 50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name cannot exceed 50 characters'),
  body('phone')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Phone number cannot exceed 20 characters'),
  body('specialization')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Specialization cannot exceed 100 characters'),
  body('barNumber')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Bar number cannot exceed 50 characters'),
  body('office')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Office cannot exceed 100 characters')
];

const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
];

// Public routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfileValidation, updateProfile);
router.put('/change-password', protect, changePasswordValidation, changePassword);

// Admin only routes
router.get('/users', protect, authorize('admin'), getUsers);
router.put('/users/:id/deactivate', protect, authorize('admin'), deactivateUser);

module.exports = router;