const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

// Import controllers and middleware
const {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  getUsers,
  deactivateUser,
  getAuditLogs
} = require('../controllers/authController');

const { protect, authorize } = require('../middleware/auth');

// Validation rules
const registerValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required'),
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required'),
  body('role')
    .optional()
    .isIn(['admin', 'lawyer', 'paralegal', 'assistant'])
    .withMessage('Invalid role specified')
];

const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required'),
  body('password')
    .trim()
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
router.post('/logout', protect, logout);
router.get('/audit-logs', protect, authorize('admin'), getAuditLogs);

// Admin only routes
router.get('/users', protect, authorize('admin'), getUsers);
router.put('/users/:id/deactivate', protect, authorize('admin'), deactivateUser);

// Public endpoint to get lawyers (for case assignment)
router.get('/lawyers', protect, (req, res) => {
  User.findAll({
    where: {
      role: ['lawyer', 'admin'],
      isActive: true
    },
    attributes: ['id', 'firstName', 'lastName', 'email', 'role']
  })
  .then(users => {
    res.json({ success: true, data: users });
  })
  .catch(err => {
    res.status(500).json({ success: false, message: err.message });
  });
});

// Public validation endpoint for other microservices
router.get('/validate', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }
  
  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    return res.status(200).json({
      success: true,
      data: { user: decoded }
    });
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

module.exports = router;