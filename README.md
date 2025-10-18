# 🎵 Spotify Clone - Full Stack Music Application

![Demo App](/frontend/public/screenshot-for-readme.png)

A full-stack Spotify clone built with React, TypeScript, Node.js, Express, and MongoDB. Features include music playback, custom playlists, real-time chat, user library management, and an admin dashboard.

## ✨ Features

- 🎸 Music playback with play, pause, next, previous controls
- 🔈 Volume control with slider
- 📱 Custom playlist creation and management
- ❤️ Like songs, albums, and follow artists
- 📚 Personal library with liked songs, albums, and playlists
- 💬 Real-time chat integrated into the application
- 👥 See what other users are listening to in real-time
- 👨‍💼 Online/Offline status indicators
- 🎧 Admin dashboard to create albums and songs
- 📊 Analytics and statistics dashboard
- 🔍 Search functionality for songs and artists
- 🎨 Spotify-inspired UI with smooth animations

---

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Building for Production](#building-for-production)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)
- [Tech Stack](#tech-stack)

---

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18+ recommended) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **MongoDB** - Local installation or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
- **Cloudinary Account** (Optional) - For image uploads [Cloudinary](https://cloudinary.com/)
- **Clerk Account** - For authentication [Clerk](https://clerk.dev/)

---

## 📦 Installation

### 1. Clone the repository

\`\`\`bash
git clone https://github.com/zayar-myo-oo/spotify-clone.git
cd spotify-clone
\`\`\`

### 2. Install Backend Dependencies

\`\`\`bash
cd backend
npm install
\`\`\`

### 3. Install Frontend Dependencies

\`\`\`bash
cd ../frontend
npm install
\`\`\`

---

## 🔐 Environment Variables

### Backend Environment Setup

Create a \`.env\` file in the \`backend\` folder:

\`\`\`bash
cd backend
touch .env
\`\`\`

Add the following variables to \`backend/.env\`:

\`\`\`env

# Server Configuration

PORT=4000

NODE_ENV=development

# Database

MONGODB_URI=mongodb://localhost:27017/spotify-clone

# or use MongoDB Atlas:

MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/spotify-clone

# Clerk Authentication

CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here

CLERK_SECRET_KEY=sk_test_your_secret_key_here

# Cloudinary (for image/audio uploads)

CLOUDINARY_CLOUD_NAME=your_cloud_name

CLOUDINARY_API_KEY=your_api_key

CLOUDINARY_API_SECRET=your_api_secret

# Admin Email (optional - for admin dashboard access)

ADMIN_EMAIL=your-admin@example.com
\`\`\`

### Frontend Environment Setup

Create a \`.env\` file in the \`frontend\` folder:

\`\`\`bash
cd frontend
touch .env
\`\`\`

Add the following variables to \`frontend/.env\`:

\`\`\`env

# Clerk Authentication

VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
\`\`\`

### 📝 How to Get API Keys

1. **MongoDB URI**:

   - Local: \`mongodb://localhost:27017/spotify-clone\`
   - Atlas: Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas), create a cluster, and get your connection string

2. **Clerk Keys**:

   - Sign up at [Clerk](https://clerk.dev/)
   - Create a new application
   - Copy the publishable and secret keys from the dashboard

3. **Cloudinary**:
   - Sign up at [Cloudinary](https://cloudinary.com/)
   - Get your cloud name, API key, and API secret from the dashboard

---

## 🚀 Running the Application

### Development Mode

You'll need to run both the backend and frontend servers simultaneously.

#### Option 1: Using Two Terminal Windows

**Terminal 1 - Backend:**

\`\`\`bash
cd backend

npm run dev
\`\`\`

The backend server will start on \`http://localhost:4000\`

**Terminal 2 - Frontend:**

\`\`\`bash
cd frontend

npm run dev
\`\`\`

The frontend will start on \`http://localhost:5173\` (or another port if 5173 is busy)

#### Option 2: Using a Single Command

From the root directory, you can use concurrently:

\`\`\`bash

# Install concurrently globally (if not already installed)

npm install -g concurrently

# Run both servers

concurrently "cd backend && npm run dev" "cd frontend && npm run dev"
\`\`\`

### Accessing the Application

Once both servers are running:

- **Frontend**: Open your browser and navigate to \`http://localhost:5173\`
- **Backend API**: Available at \`http://localhost:4000/api\`

### First Time Setup

1. **Sign Up**: Create an account using Clerk authentication
2. **Admin Access**: Use the email specified in \`ADMIN_EMAIL\` to access the admin dashboard at \`/admin\`
3. **Add Content**: Use the admin dashboard to create albums and upload songs

---

## 🏗️ Building for Production

### Build the Frontend

\`\`\`bash
cd frontend
npm run build
\`\`\`

This creates an optimized production build in the \`frontend/dist\` folder.

### Run Backend in Production Mode

The backend is configured to serve the built frontend when \`NODE_ENV=production\`:

\`\`\`bash

# Make sure you've built the frontend first

cd frontend
npm run build

# Start backend in production mode

cd ../backend
NODE_ENV=production npm start
\`\`\`

The entire application will be available at \`http://localhost:4000\`

---

## 📚 API Documentation

### Base URL

\`\`\`
http://localhost:4000/api
\`\`\`

### Authentication

Most endpoints require authentication via Clerk. Include the Clerk session token in your requests.

### Main Endpoints

#### Albums

- \`GET /api/albums\` - Get all albums
- \`GET /api/albums/:id\` - Get album by ID
- \`POST /api/admin/albums\` - Create album (Admin only)
- \`DELETE /api/admin/albums/:id\` - Delete album (Admin only)

#### Songs

- \`GET /api/songs/:id\` - Get song by ID
- \`GET /api/songs/featured\` - Get featured songs
- \`GET /api/songs/made-for-you\` - Get personalized recommendations
- \`GET /api/songs/trending\` - Get trending songs
- \`GET /api/songs/search?query=...\` - Search songs
- \`POST /api/admin/songs\` - Create song (Admin only)
- \`DELETE /api/admin/songs/:id\` - Delete song (Admin only)

#### Playlists

- \`GET /api/playlists\` - Get user's playlists (Auth required)
- \`GET /api/playlists/:id\` - Get playlist by ID
- \`POST /api/playlists\` - Create playlist (Auth required)
- \`PUT /api/playlists/:id\` - Update playlist (Auth required)
- \`DELETE /api/playlists/:id\` - Delete playlist (Auth required)
- \`POST /api/playlists/:playlistId/songs\` - Add song to playlist (Auth required)
- \`DELETE /api/playlists/:playlistId/songs/:songId\` - Remove song from playlist (Auth required)

#### Library

- \`GET /api/library\` - Get user's library (Auth required)
- \`POST /api/library/songs/:songId\` - Toggle like song (Auth required)
- \`POST /api/library/albums/:albumId\` - Toggle like album (Auth required)
- \`POST /api/library/artists/:artistName\` - Toggle follow artist (Auth required)

#### Stats

- \`GET /api/stats\` - Get platform statistics (Admin only)

#### Users

- \`GET /api/users\` - Get all users (Auth required)
- \`GET /api/users/messages/:userId\` - Get messages with user (Auth required)

---

## 🐛 Troubleshooting

### Common Issues

#### 1. "require is not defined" error in Tailwind config

**Problem**: Using CommonJS \`require()\` in an ES module context.

**Solution**: Update \`frontend/tailwind.config.js\` to use ES module imports:

\`\`\`javascript
import tailwindcssAnimate from "tailwindcss-animate";

export default {
// ... config
plugins: [tailwindcssAnimate],
};
\`\`\`

#### 2. MongoDB Connection Failed

**Solutions**:

- Ensure MongoDB is running locally: \`mongod\`
- Check your \`MONGODB_URI\` in \`.env\`
- For MongoDB Atlas, ensure your IP is whitelisted
- Verify database username and password are correct

#### 3. Clerk Authentication Errors

**Solutions**:

- Verify \`CLERK_PUBLISHABLE_KEY\` and \`CLERK_SECRET_KEY\` are correct
- Ensure the same publishable key is used in both frontend and backend
- Check Clerk dashboard for any configuration issues

#### 4. Port Already in Use

\`\`\`bash

# Find and kill the process using the port (macOS/Linux)

lsof -ti:4000 | xargs kill -9

# Or change the PORT in backend/.env

PORT=5000
\`\`\`

#### 5. Images/Audio Not Uploading

**Solutions**:

- Verify Cloudinary credentials in \`.env\`
- Check file size limits (default: 10MB)
- Ensure proper file types (jpg, png for images; mp3 for audio)

#### 6. CORS Errors

**Solutions**:

- Ensure frontend is making requests to the correct backend URL
- Check \`backend/src/index.js\` CORS configuration

#### 7. Build Errors

\`\`\`bash

# Clear node_modules and reinstall

rm -rf node_modules package-lock.json
npm install

# Update browserslist database

npx update-browserslist-db@latest

# Clear Vite cache

rm -rf node_modules/.vite
\`\`\`

---

## 🛠️ Tech Stack

### Frontend

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **React Router** - Navigation
- **Clerk** - Authentication
- **Socket.io Client** - Real-time features
- **Axios** - HTTP client
- **Lucide React** - Icons

### Backend

- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Socket.io** - Real-time communication
- **Clerk** - Authentication
- **Cloudinary** - Media storage
- **Express FileUpload** - File handling
- **Node-cron** - Scheduled tasks

---

## 📝 Additional Scripts

### Backend

\`\`\`bash
npm run dev # Start development server with nodemon
npm start # Start production server
\`\`\`

### Frontend

\`\`\`bash
npm run dev # Start development server
npm run build # Build for production
npm run preview # Preview production build
npm run lint # Run ESLint
\`\`\`

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is open source and available under the MIT License.

---

**Enjoy building with this Spotify Clone! 🎵**
