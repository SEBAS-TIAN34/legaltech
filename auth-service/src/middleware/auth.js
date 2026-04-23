const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes
const protect = async (req, res, next) => {
  try {
    let token;

    // Check if token exists in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this resource. Please login.'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

      // Get user from token
      const user = await User.findById(decoded.userId).select('-password');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found. Token is invalid.'
        });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Account is deactivated. Please contact administrator.'
        });
      }

      // Add user to request
      req.user = {
        userId: user._id,
        email: user.email,
        role: user.role,
        fullName: user.fullName
      };

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Token is invalid or expired'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error in authentication'
    });
  }
};

// Middleware to check if user has required role
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not authorized to access this resource`
      });
    }

    next();
  };
};

// Middleware for optional authentication (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const user = await User.findById(decoded.userId).select('-password');

        if (user && user.isActive) {
          req.user = {
            userId: user._id,
            email: user.email,
            role: user.role,
            fullName: user.fullName
          };
        }
      } catch (error) {
        // Token is invalid but we don't fail the request
        console.log('Optional auth token invalid:', error.message);
      }
    }

    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    next(); // Continue even if there's an error
  }
};

// Middleware to refresh token if close to expiry
const refreshToken = async (req, res, next) => {
  try {
    if (req.user) {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.decode(token);

      // If token expires within 1 hour, refresh it
      const timeUntilExpiry = decoded.exp * 1000 - Date.now();
      const oneHour = 60 * 60 * 1000;

      if (timeUntilExpiry < oneHour) {
        const newToken = jwt.sign(
          { userId: req.user.userId },
          process.env.JWT_SECRET || 'your-secret-key',
          { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        // Add new token to response headers
        res.set('X-New-Token', newToken);
      }
    }

    next();
  } catch (error) {
    console.error('Refresh token middleware error:', error);
    next();
  }
};

module.exports = {
  protect,
  authorize,
  optionalAuth,
  refreshToken
};