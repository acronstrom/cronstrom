const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();

// CORS configuration - allow requests from any origin
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
  credentials: false
};

// Middleware
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

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

// Admin credentials from environment variables (fallback to demo for development)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@cronstrom.net';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

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
    
    // Create education table
    await sql`
      CREATE TABLE IF NOT EXISTS education (
        id SERIAL PRIMARY KEY,
        institution VARCHAR(255) NOT NULL,
        degree VARCHAR(255),
        year VARCHAR(50),
        type VARCHAR(50) DEFAULT 'education',
        url VARCHAR(500),
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

  // Admin login (credentials from environment variables)
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const payload = {
      user: {
        id: 'admin-id',
        name: 'Lena Cronström',
        email: ADMIN_EMAIL,
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
  if (req.user.id === 'admin-id') {
    return res.json({
      user: {
        id: 'admin-id',
        name: 'Lena Cronström',
        email: ADMIN_EMAIL,
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

// EDUCATION ROUTES
app.get('/api/education', async (req, res) => {
  if (!dbConnected || !sql) {
    return res.json({ education: [], database: false });
  }
  
  try {
    await initDB();
    const { rows } = await sql`SELECT * FROM education ORDER BY year DESC`;
    res.json({ education: rows, database: true });
  } catch (err) {
    console.error('Get education error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/education', auth, async (req, res) => {
  if (!dbConnected || !sql) {
    return res.status(503).json({ error: 'Database not connected' });
  }
  
  const { institution, degree, year, type, url } = req.body;
  
  try {
    await initDB();
    const { rows } = await sql`
      INSERT INTO education (institution, degree, year, type, url)
      VALUES (${institution}, ${degree}, ${year}, ${type || 'education'}, ${url || null})
      RETURNING *
    `;
    res.json({ education: rows[0], message: 'Education created', database: true });
  } catch (err) {
    console.error('Create education error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/education/:id', auth, async (req, res) => {
  if (!dbConnected || !sql) {
    return res.status(503).json({ error: 'Database not connected' });
  }
  
  const { id } = req.params;
  const { institution, degree, year, type, url } = req.body;
  
  try {
    const { rows } = await sql`
      UPDATE education 
      SET institution = ${institution}, degree = ${degree}, year = ${year}, 
          type = ${type || 'education'}, url = ${url || null}
      WHERE id = ${id}
      RETURNING *
    `;
    res.json({ education: rows[0], message: 'Education updated' });
  } catch (err) {
    console.error('Update education error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/education/:id', auth, async (req, res) => {
  if (!dbConnected || !sql) {
    return res.status(503).json({ error: 'Database not connected' });
  }
  
  const { id } = req.params;
  
  try {
    await sql`DELETE FROM education WHERE id = ${id}`;
    res.json({ message: 'Education deleted' });
  } catch (err) {
    console.error('Delete education error:', err);
    res.status(500).json({ error: err.message });
  }
});

// IMAGE UPLOAD - Get upload URL for client-side upload
app.post('/api/upload/request', auth, async (req, res) => {
  try {
    const { handleUpload } = require('@vercel/blob/client');
    const { filename } = req.body;
    
    // Generate a client upload token
    const response = await handleUpload({
      body: req.body,
      request: req,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        maximumSizeInBytes: 10 * 1024 * 1024, // 10MB
      }),
      onUploadCompleted: async ({ blob }) => {
        console.log('Upload completed:', blob.url);
      },
    });
    
    res.json(response);
  } catch (err) {
    console.error('Upload request error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Direct server upload for smaller images
app.post('/api/upload', auth, async (req, res) => {
  try {
    const { put } = require('@vercel/blob');
    const { filename, contentType, data } = req.body;
    
    if (!data) {
      return res.status(400).json({ error: 'No image data provided' });
    }
    
    // Convert base64 to buffer
    const base64Data = data.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Check size - if too large, return error
    if (buffer.length > 3 * 1024 * 1024) { // 3MB limit for API route
      return res.status(413).json({ 
        error: 'Image too large. Use an image URL instead.',
        hint: 'Upload to WordPress and paste the URL'
      });
    }
    
    // Upload to Vercel Blob
    const blob = await put(filename || `artwork-${Date.now()}.jpg`, buffer, {
      access: 'public',
      contentType: contentType || 'image/jpeg'
    });
    
    res.json({ url: blob.url, message: 'Image uploaded successfully' });
  } catch (err) {
    console.error('Upload error:', err);
    if (err.message.includes('BLOB')) {
      return res.status(503).json({ 
        error: 'Blob storage not configured. Use image URLs instead.',
        hint: 'Add BLOB_READ_WRITE_TOKEN in Vercel Storage settings'
      });
    }
    res.status(500).json({ error: err.message });
  }
});

// CONTACT FORM EMAIL ROUTE
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email and message are required' });
  }

  // Check if Resend API key is configured
  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY not configured');
    return res.status(503).json({ 
      error: 'Email service not configured',
      hint: 'Add RESEND_API_KEY in Vercel environment variables'
    });
  }

  try {
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
      from: 'Kontaktformulär <onboarding@resend.dev>',
      to: process.env.CONTACT_EMAIL || 'lena@cronstrom.net',
      replyTo: email,
      subject: `Nytt meddelande från ${name}`,
      html: `
        <h2>Nytt meddelande från kontaktformuläret</h2>
        <p><strong>Från:</strong> ${name}</p>
        <p><strong>E-post:</strong> ${email}</p>
        <hr>
        <p><strong>Meddelande:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p style="color: #666; font-size: 12px;">
          Skickat via kontaktformuläret på lena.cronstrom.net
        </p>
      `
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ error: 'Failed to send email', details: error.message });
    }

    res.json({ success: true, message: 'Email sent successfully', id: data?.id });
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({ error: 'Failed to send email', details: err.message });
  }
});

// Export for Vercel
module.exports = app;
