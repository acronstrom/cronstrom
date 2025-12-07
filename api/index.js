const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Check if Postgres is available
let sql;
let dbConnected = false;

try {
  const postgres = require('@vercel/postgres');
  sql = postgres.sql;
  dbConnected = true;
} catch (err) {
  console.log('Vercel Postgres not available, running in demo mode');
  dbConnected = false;
}

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

// Initialize database tables
async function initDB() {
  if (!dbConnected || !sql) {
    console.log('Database not connected, skipping init');
    return false;
  }
  
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'viewer',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    await sql`
      CREATE TABLE IF NOT EXISTS artworks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        medium VARCHAR(255),
        dimensions VARCHAR(255),
        year VARCHAR(50),
        image_url TEXT,
        category VARCHAR(255),
        description TEXT,
        status VARCHAR(50) DEFAULT 'available',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS exhibitions (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        venue VARCHAR(255),
        date VARCHAR(255),
        category VARCHAR(50),
        description TEXT,
        is_current BOOLEAN DEFAULT false,
        is_upcoming BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    console.log('Database tables initialized');
    return true;
  } catch (err) {
    console.error('Database init error:', err);
    return false;
  }
}

// Routes

// Health check & DB init
app.get('/api/health', async (req, res) => {
  try {
    const dbInit = await initDB();
    res.json({ 
      status: 'ok', 
      database: dbConnected && dbInit ? 'connected' : 'not connected',
      postgres_available: dbConnected,
      timestamp: new Date().toISOString(),
      env_check: {
        POSTGRES_URL: !!process.env.POSTGRES_URL,
        JWT_SECRET: !!process.env.JWT_SECRET
      }
    });
  } catch (err) {
    res.json({ 
      status: 'ok', 
      database: 'error', 
      error: err.message,
      timestamp: new Date().toISOString() 
    });
  }
});

// AUTH ROUTES

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
    return res.json({ token, user: payload.user });
  }

  // Database login
  try {
    const { rows } = await sql`SELECT * FROM users WHERE email = ${email}`;
    const user = rows[0];
    
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
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/auth/profile', auth, async (req, res) => {
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
    const { rows } = await sql`SELECT id, name, email, role FROM users WHERE id = ${req.user.id}`;
    res.json({ user: rows[0] });
  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ARTWORK ROUTES

app.get('/api/artworks', async (req, res) => {
  if (!dbConnected || !sql) {
    return res.json({ artworks: [], database: false });
  }
  
  try {
    await initDB();
    const { rows } = await sql`SELECT * FROM artworks ORDER BY created_at DESC`;
    res.json({ artworks: rows, database: true });
  } catch (err) {
    console.error('Get artworks error:', err);
    res.json({ artworks: [], database: false, error: err.message });
  }
});

app.post('/api/artworks', auth, async (req, res) => {
  if (!dbConnected || !sql) {
    return res.status(503).json({ error: 'Database not connected' });
  }
  
  const { title, medium, dimensions, year, image_url, category, description, status } = req.body;
  
  try {
    await initDB();
    const { rows } = await sql`
      INSERT INTO artworks (title, medium, dimensions, year, image_url, category, description, status)
      VALUES (${title}, ${medium}, ${dimensions}, ${year}, ${image_url}, ${category}, ${description}, ${status || 'available'})
      RETURNING *
    `;
    res.json({ artwork: rows[0], message: 'Artwork created', database: true });
  } catch (err) {
    console.error('Create artwork error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/artworks/:id', auth, async (req, res) => {
  if (!dbConnected || !sql) {
    return res.status(503).json({ error: 'Database not connected' });
  }
  
  const { id } = req.params;
  const { title, medium, dimensions, year, image_url, category, description, status } = req.body;
  
  try {
    const { rows } = await sql`
      UPDATE artworks 
      SET title = ${title}, medium = ${medium}, dimensions = ${dimensions}, 
          year = ${year}, image_url = ${image_url}, category = ${category}, 
          description = ${description}, status = ${status}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;
    res.json({ artwork: rows[0], message: 'Artwork updated' });
  } catch (err) {
    console.error('Update artwork error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/artworks/:id', auth, async (req, res) => {
  if (!dbConnected || !sql) {
    return res.status(503).json({ error: 'Database not connected' });
  }
  
  const { id } = req.params;
  
  try {
    await sql`DELETE FROM artworks WHERE id = ${id}`;
    res.json({ message: 'Artwork deleted' });
  } catch (err) {
    console.error('Delete artwork error:', err);
    res.status(500).json({ error: err.message });
  }
});

// EXHIBITION ROUTES

app.get('/api/exhibitions', async (req, res) => {
  if (!dbConnected || !sql) {
    return res.json({ exhibitions: [], database: false });
  }
  
  try {
    await initDB();
    const { rows } = await sql`SELECT * FROM exhibitions ORDER BY created_at DESC`;
    res.json({ exhibitions: rows, database: true });
  } catch (err) {
    console.error('Get exhibitions error:', err);
    res.json({ exhibitions: [], database: false, error: err.message });
  }
});

app.post('/api/exhibitions', auth, async (req, res) => {
  if (!dbConnected || !sql) {
    return res.status(503).json({ error: 'Database not connected' });
  }
  
  const { title, venue, date, category, description, is_current, is_upcoming } = req.body;
  
  try {
    await initDB();
    const { rows } = await sql`
      INSERT INTO exhibitions (title, venue, date, category, description, is_current, is_upcoming)
      VALUES (${title}, ${venue}, ${date}, ${category}, ${description}, ${is_current || false}, ${is_upcoming || false})
      RETURNING *
    `;
    res.json({ exhibition: rows[0], message: 'Exhibition created', database: true });
  } catch (err) {
    console.error('Create exhibition error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/exhibitions/:id', auth, async (req, res) => {
  if (!dbConnected || !sql) {
    return res.status(503).json({ error: 'Database not connected' });
  }
  
  const { id } = req.params;
  const { title, venue, date, category, description, is_current, is_upcoming } = req.body;
  
  try {
    const { rows } = await sql`
      UPDATE exhibitions 
      SET title = ${title}, venue = ${venue}, date = ${date}, 
          category = ${category}, description = ${description},
          is_current = ${is_current}, is_upcoming = ${is_upcoming}
      WHERE id = ${id}
      RETURNING *
    `;
    res.json({ exhibition: rows[0], message: 'Exhibition updated' });
  } catch (err) {
    console.error('Update exhibition error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/exhibitions/:id', auth, async (req, res) => {
  if (!dbConnected || !sql) {
    return res.status(503).json({ error: 'Database not connected' });
  }
  
  const { id } = req.params;
  
  try {
    await sql`DELETE FROM exhibitions WHERE id = ${id}`;
    res.json({ message: 'Exhibition deleted' });
  } catch (err) {
    console.error('Delete exhibition error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Export for Vercel
module.exports = app;
