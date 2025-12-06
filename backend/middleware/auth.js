const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Demo admin user (for testing without MongoDB)
const DEMO_ADMIN = {
  _id: 'demo-admin-id',
  id: 'demo-admin-id',
  email: 'admin@cronstrom.net',
  name: 'Admin',
  role: 'admin',
  isActive: true
};

// Verify JWT token
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided, access denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'demo-secret-key');
    
    // Check if this is the demo user
    if (decoded.userId === 'demo-admin-id') {
      req.user = DEMO_ADMIN;
      return next();
    }

    const user = await User.findById(decoded.userId);
    
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid token or user is inactive' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Check if user is admin
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Access denied. Admin rights required.' });
  }
};

// Check if user is admin or editor
const editorOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'editor')) {
    next();
  } else {
    res.status(403).json({ error: 'Access denied. Editor rights required.' });
  }
};

module.exports = {
  auth,
  adminOnly,
  editorOnly
};