# Lena Cronström - Artist Portfolio Website

A beautiful, minimalist artist portfolio website built with React and Node.js, featuring an admin panel for content management.

## Features

### Public Website
- **Home** - Hero section with artist introduction
- **Gallery** - Artwork showcase with modal view
- **Exhibitions** - List of exhibitions by category
- **Nobel** - Special Nobel-related works
- **Glasfusing** - Glass art collection
- **Textilmåleri** - Textile art collection
- **Education** - Education background and courses
- **Contact** - Contact form and information

### Admin Panel
- **Dashboard** - Overview and quick access to all features
- **Gallery Manager** - Add, edit, delete artworks with image upload
- **Settings** - Manage site content, contact info, and profile

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS 4 for styling
- React Router for navigation
- Motion for animations
- Lucide React for icons
- Axios for API calls

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT authentication
- Multer for file uploads
- bcryptjs for password hashing

## Getting Started

### Prerequisites
- Node.js 20+ 
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cronstrom.net
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

   Create a `.env` file in the backend folder:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/cronstrom_website
   JWT_SECRET=your-super-secret-jwt-key-change-this
   JWT_EXPIRES_IN=7d
   FRONTEND_URL=http://localhost:3000
   ADMIN_EMAIL=admin@cronstrom.net
   ADMIN_PASSWORD=admin123
   ADMIN_NAME=Admin
   ```

   Seed the database with admin user:
   ```bash
   npm run seed
   ```

   Start the backend:
   ```bash
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the application**
   - Public website: http://localhost:3000
   - Admin panel: http://localhost:3000/admin/login
   
   Default admin credentials:
   - Email: `admin@cronstrom.net`
   - Password: `admin123`

## Project Structure

```
cronstrom.net/
├── backend/
│   ├── middleware/
│   │   └── auth.js          # JWT authentication middleware
│   ├── models/
│   │   ├── Content.js       # Content/artwork model
│   │   ├── Setting.js       # Site settings model
│   │   └── User.js          # User model
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   ├── content.js       # Content CRUD routes
│   │   ├── settings.js      # Settings routes
│   │   └── upload.js        # File upload routes
│   ├── utils/
│   │   └── seedAdmin.js     # Database seeding script
│   └── server.js            # Express server setup
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── home/        # Hero component
│   │   │   ├── layout/      # Navbar, Footer, ScrollToTop
│   │   │   └── shared/      # Reusable components
│   │   ├── context/
│   │   │   └── AuthContext.tsx  # Authentication context
│   │   ├── lib/
│   │   │   ├── api.ts       # API client functions
│   │   │   ├── data.ts      # Default/fallback data
│   │   │   └── types.ts     # TypeScript types
│   │   ├── pages/
│   │   │   ├── admin/       # Admin panel pages
│   │   │   └── *.tsx        # Public pages
│   │   ├── App.tsx          # Main app with routing
│   │   ├── index.css        # Global styles
│   │   └── main.tsx         # Entry point
│   └── index.html
│
└── README.md
```

## Design

The design follows a minimalist, editorial aesthetic inspired by high-end art galleries:

- **Typography**: Cormorant Garamond (serif) for headings, Inter (sans) for body
- **Color Palette**: Primarily black, white, and neutral grays
- **Spacing**: Generous whitespace for elegant presentation
- **Animations**: Subtle motion effects for enhanced UX

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get current user
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/change-password` - Change password

### Content
- `GET /api/content` - Get all content
- `GET /api/content/:id` - Get content by ID
- `GET /api/content/slug/:slug` - Get content by slug
- `POST /api/content` - Create content (auth required)
- `PUT /api/content/:id` - Update content (auth required)
- `DELETE /api/content/:id` - Delete content (admin only)

### Upload
- `POST /api/upload/image` - Upload single image
- `POST /api/upload/gallery` - Upload multiple images
- `DELETE /api/upload/:filename` - Delete file
- `GET /api/upload/list` - List uploaded files

### Settings
- `GET /api/settings/public` - Get public settings
- `GET /api/settings` - Get all settings (auth required)
- `PUT /api/settings/:key` - Update setting (admin only)
- `PUT /api/settings` - Bulk update settings (admin only)

## Deployment

### Backend
The backend can be deployed to any Node.js hosting service (Railway, Render, DigitalOcean, etc.)

### Frontend
The frontend can be built and deployed to any static hosting service:
```bash
cd frontend
npm run build
```

Deploy the `dist` folder to Vercel, Netlify, or any static host.

## License

MIT License - feel free to use this template for your own artist portfolio.

## Credits

Design inspired by the Figma template: [Artist Portfolio Website PRD](https://www.figma.com/make/pPMn7jHOIfSYpfTBLBXsOS/Artist-Portfolio-Website-PRD)
