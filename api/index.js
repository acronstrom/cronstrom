const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection (only connect once)
let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      isConnected = true;
      console.log('MongoDB Connected');
    }
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
  }
}

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'editor', 'viewer'], default: 'viewer' }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

// Auth middleware
const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'demo-secret-key');
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Demo mode credentials
const DEMO_EMAIL = 'admin@cronstrom.net';
const DEMO_PASSWORD = 'admin123';

// Routes
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  // Demo mode login (works without database)
  if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
    const payload = {
      user: {
        id: 'demo-admin-id',
        name: 'Lena Cronström',
        email: DEMO_EMAIL,
        role: 'admin',
      },
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'demo-secret-key', { expiresIn: '7d' });
    return res.json({ 
      token,
      user: payload.user
    });
  }

  // Database login
  try {
    await connectDB();
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const payload = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'demo-secret-key', { expiresIn: '7d' });
    res.json({ token, user: payload.user });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/auth/profile', auth, async (req, res) => {
  // Demo user
  if (req.user.id === 'demo-admin-id') {
    return res.json({
      user: {
        id: 'demo-admin-id',
        name: 'Lena Cronström',
        email: DEMO_EMAIL,
        role: 'admin',
      }
    });
  }

  try {
    await connectDB();
    const user = await User.findById(req.user.id).select('-password');
    res.json({ user });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Export for Vercel
module.exports = app;

