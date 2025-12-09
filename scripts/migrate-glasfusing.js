// Migration script to upload glasfusing images from WordPress to Vercel Blob
// Run with: node scripts/migrate-glasfusing.js

const API_URL = 'https://cronstrom.vercel.app/api';

// Glasfusing images to migrate
const glasfusingImages = [
  {
    imageUrl: 'https://cronstrom.net/wp-content/uploads/2024/12/Bla-bordsdekoration--scaled.jpg',
    title: 'Blå bordsdekoration',
    medium: 'Glasfusing',
    dimensions: '',
    year: '2024',
    category: 'Glasfusing',
    description: 'Blå bordsdekoration i glasfusing'
  },
  {
    imageUrl: 'https://cronstrom.net/wp-content/uploads/2024/12/Blarott-fat.jpg',
    title: 'Blårött fat',
    medium: 'Glasfusing',
    dimensions: '',
    year: '2024',
    category: 'Glasfusing',
    description: 'Fat i blått och rött glas'
  },
  {
    imageUrl: 'https://cronstrom.net/wp-content/uploads/2024/12/IMG_8533-scaled.jpg',
    title: 'Glasfusing komposition',
    medium: 'Glasfusing',
    dimensions: '',
    year: '2024',
    category: 'Glasfusing',
    description: 'Glasfusing komposition'
  },
  {
    imageUrl: 'https://cronstrom.net/wp-content/uploads/2024/12/svartvitt-fat-scaled.jpg',
    title: 'Svartvitt fat',
    medium: 'Glasfusing',
    dimensions: '',
    year: '2024',
    category: 'Glasfusing',
    description: 'Svartvitt fat i glasfusing'
  },
  {
    imageUrl: 'https://cronstrom.net/wp-content/uploads/2018/11/20140129220455.jpg',
    title: 'Glassmycke 1',
    medium: 'Glasfusing',
    dimensions: '',
    year: '2014',
    category: 'Glasfusing',
    description: 'Handgjort glassmycke'
  },
  {
    imageUrl: 'https://cronstrom.net/wp-content/uploads/2018/11/20140129221355.jpg',
    title: 'Glassmycke 2',
    medium: 'Glasfusing',
    dimensions: '',
    year: '2014',
    category: 'Glasfusing',
    description: 'Glassmycke i regnbågens färger'
  },
  {
    imageUrl: 'https://cronstrom.net/wp-content/uploads/2018/11/20140129221102.jpg',
    title: 'Glassmycke 3',
    medium: 'Glasfusing',
    dimensions: '',
    year: '2014',
    category: 'Glasfusing',
    description: 'Unik glasfusing kreation'
  }
];

async function login() {
  console.log('Logging in...');
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: process.env.ADMIN_EMAIL || 'admin@cronstrom.net',
      password: process.env.ADMIN_PASSWORD || 'admin123'
    })
  });
  
  if (!response.ok) {
    throw new Error(`Login failed: ${response.status}`);
  }
  
  const data = await response.json();
  return data.token;
}

async function migrateImages(token) {
  console.log('Migrating images...');
  
  const response = await fetch(`${API_URL}/migrate-images`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': token
    },
    body: JSON.stringify({ images: glasfusingImages })
  });
  
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Migration failed: ${response.status} - ${text}`);
  }
  
  const result = await response.json();
  return result;
}

async function main() {
  try {
    console.log('Starting glasfusing image migration...\n');
    
    const token = await login();
    console.log('✓ Logged in successfully\n');
    
    const result = await migrateImages(token);
    console.log('✓ Migration completed!\n');
    console.log(result.message);
    
    // Show results
    result.results.forEach((r, i) => {
      if (r.success) {
        console.log(`  ✓ ${glasfusingImages[i].title}: ${r.blobUrl}`);
      } else {
        console.log(`  ✗ ${glasfusingImages[i].title}: ${r.error}`);
      }
    });
    
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  }
}

main();

