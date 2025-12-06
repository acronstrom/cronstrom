const mongoose = require('mongoose');
const User = require('../models/User');
const Setting = require('../models/Setting');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cronstrom_website';

const defaultSettings = [
  {
    key: 'artistName',
    value: 'Lena Cronström',
    type: 'string',
    description: 'Artist name displayed on the website',
    category: 'general',
    isPublic: true
  },
  {
    key: 'tagline',
    value: 'Utforskar tystnaden mellan tankarna',
    type: 'string',
    description: 'Tagline shown on hero section',
    category: 'general',
    isPublic: true
  },
  {
    key: 'shortBio',
    value: 'Lena Cronström är en samtida konstnär känd för sin känslofyllda abstrakta expressionism och minimalistiska inställning. Hennes arbete utforskar teman som minne, natur och det mänskliga tillståndet.',
    type: 'string',
    description: 'Short bio for homepage',
    category: 'general',
    isPublic: true
  },
  {
    key: 'email',
    value: 'hello@cronstrom.net',
    type: 'string',
    description: 'Contact email',
    category: 'contact',
    isPublic: true
  },
  {
    key: 'phone',
    value: '070-123 45 67',
    type: 'string',
    description: 'Contact phone',
    category: 'contact',
    isPublic: true
  },
  {
    key: 'address',
    value: 'Artillerigatan 12\n114 51 Stockholm',
    type: 'string',
    description: 'Studio address',
    category: 'contact',
    isPublic: true
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create admin user if doesn't exist
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@cronstrom.net';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const adminName = process.env.ADMIN_NAME || 'Admin';

    let admin = await User.findOne({ email: adminEmail });
    
    if (!admin) {
      admin = new User({
        email: adminEmail,
        password: adminPassword,
        name: adminName,
        role: 'admin',
        isActive: true
      });
      await admin.save();
      console.log(`✓ Admin user created: ${adminEmail}`);
    } else {
      console.log(`✓ Admin user already exists: ${adminEmail}`);
    }

    // Seed default settings
    for (const setting of defaultSettings) {
      const existing = await Setting.findOne({ key: setting.key });
      if (!existing) {
        await Setting.create(setting);
        console.log(`✓ Setting created: ${setting.key}`);
      } else {
        console.log(`✓ Setting already exists: ${setting.key}`);
      }
    }

    console.log('\n✓ Database seeding completed!');
    console.log(`\nAdmin credentials:`);
    console.log(`  Email: ${adminEmail}`);
    console.log(`  Password: ${adminPassword}`);
    console.log(`\n⚠️  Please change the admin password after first login!`);

  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

seedDatabase();

