<div align="center">

# ☕️ RABUSTE

### *Premium Coffee Experience Meets Digital Art Gallery*

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-9.0-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)

**A revolutionary full-stack coffee shop and art gallery platform that blends premium coffee culture with digital art, powered by cutting-edge web technologies and AI-driven personalization.**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Usage](#-usage) • [Team](#-team)

---

</div>

## 🎯 About Rabuste

Rabuste is more than just a coffee shop website—it's a complete digital experience that combines:

- **☕ Premium Coffee Menu** - Curated selection of artisanal coffee blends with intelligent upselling
- **🎨 Digital Art Gallery** - Browse and purchase unique artwork from talented artists
- **🤖 AI Mood Brewer** - Personalized coffee recommendations based on your mood and preferences
- **📦 Smart Order Tracking** - Real-time order updates with interactive games while you wait
- **🎓 Workshops & Events** - Book coffee brewing workshops and art appreciation sessions
- **👥 User Experience** - Seamless authentication, profile management, and order history
- **⚡ 3D Animations** - Immersive visual experiences with Three.js and WebGL
- **🏢 Franchise System** - Comprehensive franchise enquiry and management

---

## ✨ Features

### 🛍️ Customer Features

#### Coffee & Beverage Menu
- **Smart Search & Filters** - Find your perfect brew by category, price, or name
- **Dynamic Upselling** - Intelligent suggestions for premium alternatives and pairings
- **Real-time Inventory** - Live stock indicators and sold today counters
- **Bestsellers & Trending** - Discover popular items and what's hot
- **Multiple View Modes** - Grid and list views for comfortable browsing

#### Art Gallery
- **Curated Collections** - Browse artwork by category, artist, and medium
- **High-Quality Images** - Multiple image carousel for each artwork
- **Detailed Descriptions** - Artist info, dimensions, year, and medium details
- **Seamless Purchasing** - Add to cart and checkout alongside menu items

#### AI-Powered Personalization
- **Mood-Based Recommendations** - Get coffee suggestions based on your current mood
- **Personalized Combos** - AI-generated beverage and snack pairings
- **Smart Upselling** - Context-aware premium upgrade suggestions

#### Interactive Order Experience
- **Real-time Tracking** - Live order status updates every 5 seconds
- **Estimated Wait Times** - Accurate preparation time calculations
- **Engagement Games** - Play memory games, trivia, and quizzes while waiting
- **Coffee Facts & Tips** - Learn about coffee culture during your wait
- **Order History** - View both active and completed orders with distinction

#### Workshop Booking
- **Event Calendar** - Browse upcoming coffee and art workshops
- **Easy Registration** - Book your spot with a few clicks
- **Event Details** - Complete information about instructors, timing, and content

### 🔐 Authentication & Security
- **JWT-based Auth** - Secure token-based authentication
- **Email Verification** - Confirm email addresses before account activation
- **Protected Routes** - Role-based access control (User/Admin)
- **Session Management** - Persistent login with localStorage
- **Guest Checkout** - Shop without registration, attach orders post-login

### 👨‍💼 Admin Features
- **Dashboard Analytics** - Overview of orders, revenue, and user statistics
- **Menu Management** - Add, edit, delete menu items with real-time updates
- **Gallery Management** - Manage artwork listings and inventory
- **Order Management** - View all orders, update status (pending → completed)
- **Workshop Management** - Create and manage events
- **User Management** - View users, block/unblock accounts
- **AI Configuration** - Customize AI recommendation settings

### 🎨 Design & UX
- **Brutal Design Language** - Bold, modern aesthetic with copper accents
- **Responsive Layout** - Perfect experience on desktop, tablet, and mobile
- **Smooth Animations** - Framer Motion powered transitions
- **3D Elements** - Three.js for immersive visual experiences
- **Dynamic Backgrounds** - Interactive particle effects
- **Accessibility** - Keyboard navigation and screen reader support

---

## 🚀 Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.0 | React framework with App Router |
| **React** | 19.2 | UI library |
| **TypeScript** | 5.0 | Type-safe development |
| **Tailwind CSS** | v4 | Utility-first styling |
| **Framer Motion** | 12.23 | Animation library |
| **Three.js** | 0.182 | 3D graphics |
| **@react-three/fiber** | 9.4 | React renderer for Three.js |
| **@react-three/drei** | 10.7 | Three.js helpers |
| **GSAP** | 3.14 | Advanced animations |
| **Zustand** | 5.0 | State management |
| **Lucide React** | 0.561 | Icon library |
| **Recharts** | 3.6 | Data visualization |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 20.x | Runtime environment |
| **Express** | 5.2 | Web framework |
| **MongoDB** | 9.0 | Database |
| **Mongoose** | 9.0 | ODM for MongoDB |
| **JWT** | 9.0 | Authentication tokens |
| **bcryptjs** | 3.0 | Password hashing |
| **Nodemailer** | 7.0 | Email service |
| **CORS** | 2.8 | Cross-origin requests |
| **dotenv** | 17.2 | Environment variables |

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting  
- **PostCSS** - CSS processing
- **Nodemon** - Auto-restart dev server

---

## 📦 Installation

### Prerequisites

Ensure you have the following installed:

- **Node.js** v20 or higher - [Download](https://nodejs.org/)
- **npm** or **yarn** or **pnpm**
- **MongoDB** - Local installation or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Git**

Check your versions:
```bash
node --version  # Should be v20.x or higher
npm --version   # Should be 10.x or higher
```

---

### 🔧 Backend Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/Ojas-Srivastava05/Rabuste-GWOC.git
cd Rabuste
```

#### 2. Navigate to Backend Directory
```bash
cd rabuste-backend
```

#### 3. Install Backend Dependencies
```bash
npm install
```

#### 4. Configure Environment Variables

Create a `.env` file in `rabuste-backend/`:

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/rabuste
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rabuste

# JWT Secret (use a strong random string)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Email Configuration (for Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

#### 5. Seed Database (Optional)

Populate the database with sample data:

```bash
# Seed admin user
node seedAdmin.js

# Seed artwork collection
node seedArtwork.js
```

#### 6. Start Backend Server
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

Backend will run on **http://localhost:5001**

> ⚠️ **IMPORTANT**: The backend server must be running before starting the frontend, otherwise you'll see "Failed to fetch" errors. Always start the backend first!

---

### 🎨 Frontend Setup

#### 1. Navigate to Frontend Directory
```bash
cd ../rabuste-frontend
```

#### 2. Install Frontend Dependencies
```bash
npm install
```

#### 3. Configure Environment Variables

Create a `.env.local` file in `rabuste-frontend/`:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5001

# NextAuth Configuration (if using)
NEXTAUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=http://localhost:3000

# MongoDB (for Next.js API routes)
MONGODB_URI=mongodb://localhost:27017/rabuste
```

#### 4. Start Frontend Development Server
```bash
npm run dev
```

Frontend will run on **http://localhost:3000**

---

### 🚀 Running Both Servers

**For Development:**

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd rabuste-backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd rabuste-frontend
npm run dev
```

Visit **http://localhost:3000** in your browser.

---

### 🚀 Production Build

#### Backend
```bash
cd rabuste-backend
npm start
```

#### Frontend
```bash
cd rabuste-frontend
npm run build
npm start
```

---

## 📖 Usage

### Customer Flow

1. **Browse Menu** → Visit `/menu` to explore coffee and beverages
2. **Explore Art** → Visit `/art` to browse the digital gallery
3. **Add to Cart** → Select items and quantities
4. **Checkout** → Proceed to checkout (login required for order placement)
5. **Track Order** → Visit `/order-status` to see real-time updates
6. **Play Games** → Engage with trivia and games while waiting
7. **View Completed** → Scroll down on order status to see completed orders

### Admin Flow

1. **Login** → Use admin credentials at `/auth`
2. **Dashboard** → View analytics at `/admin`
3. **Manage Menu** → Add/edit items at `/admin/menu`
4. **Manage Gallery** → Update artwork at `/admin/gallery`
5. **Process Orders** → Handle orders at `/admin/orders`
6. **Manage Workshops** → Create events at `/admin/workshops`

---

## 📁 Project Structure

```
Rabuste/
├── rabuste-backend/              # Express.js Backend
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js            # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── art.controller.js
│   │   │   └── ...
│   │   ├── models/
│   │   │   ├── art.js           # Art schema
│   │   │   ├── menu.js          # Menu schema
│   │   │   ├── order.js         # Order schema
│   │   │   └── User.js          # User schema
│   │   ├── routes/
│   │   │   ├── admin.routes.js
│   │   │   └── ...
│   │   └── app.js               # Express app config
│   ├── .env                     # Environment variables
│   ├── server.js                # Entry point
│   ├── seedAdmin.js             # Admin seeder
│   └── package.json
│
├── rabuste-frontend/            # Next.js Frontend
│   ├── app/                     # App Router pages
│   │   ├── page.tsx            # Home page
│   │   ├── menu/
│   │   │   └── page.tsx        # Menu page
│   │   ├── art/
│   │   │   └── page.tsx        # Art gallery
│   │   ├── cart/
│   │   │   └── page.tsx        # Shopping cart
│   │   ├── checkout/
│   │   │   └── page.tsx        # Checkout page
│   │   ├── order-status/
│   │   │   └── page.tsx        # Order tracking
│   │   ├── admin/              # Admin dashboard
│   │   │   ├── menu/
│   │   │   ├── gallery/
│   │   │   ├── orders/
│   │   │   └── ...
│   │   ├── api/                # API routes
│   │   │   ├── cart/
│   │   │   ├── menu/
│   │   │   ├── orders/
│   │   │   └── ...
│   │   ├── layout.tsx          # Root layout
│   │   └── globals.css         # Global styles
│   │
│   ├── components/             # React components
│   │   ├── Navbar.tsx
│   │   ├── FloatingCart.tsx
│   │   ├── DynamicBackground.tsx
│   │   ├── sections/
│   │   │   ├── HeroRevamped.tsx
│   │   │   ├── OurStorySection.tsx
│   │   │   ├── ExperienceSection.tsx
│   │   │   ├── ContactSection.tsx
│   │   │   └── footer.tsx
│   │   └── ...
│   │
│   ├── contexts/               # React contexts
│   │   └── UserContext.tsx
│   │
│   ├── lib/                    # Utilities
│   │   ├── auth.ts
│   │   ├── utils.ts
│   │   └── ...
│   │
│   ├── src/
│   │   ├── models/             # Mongoose models
│   │   │   ├── Art.ts
│   │   │   ├── Cart.ts
│   │   │   └── ...
│   │   └── lib/
│   │       └── mongodb.ts      # DB connection
│   │
│   ├── public/                 # Static assets
│   │   ├── logo.svg
│   │   └── ...
│   │
│   ├── .env.local              # Environment variables
│   ├── next.config.ts          # Next.js config
│   ├── tailwind.config.ts      # Tailwind config
│   ├── postcss.config.mjs      # PostCSS config
│   └── package.json
│
└── README.md                   # This file
```

---

## 🎨 Design System

### Color Palette

```css
/* Primary - Copper & Bronze */
--copper: #B87333
--bronze: #CD7F32
--light-copper: #D4A574

/* Neutrals */
--cream: #F5F1E8
--dark-brown: #3D2B1F
--medium-brown: #8B6F47

/* Accents */
--gold: #FFB74D
--success: #4CAF50
--error: #F44336
```

### Typography

- **Headings**: Bebas Neue (Display font)
- **Body**: Josefin Sans (Clean, modern)
- **Accent**: Lora (Elegant serif for special elements)

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/signup          # Register new user
POST   /api/auth/login           # Login user
GET    /api/auth/verify-email    # Verify email token
```

### Menu
```
GET    /api/menu                 # Get all menu items
POST   /api/menu                 # Add menu item (admin)
PATCH  /api/menu/:id             # Update menu item (admin)
DELETE /api/menu/:id             # Delete menu item (admin)
```

### Art Gallery
```
GET    /api/art                  # Get all artworks
POST   /api/art                  # Add artwork (admin)
PATCH  /api/art/:id              # Update artwork (admin)
DELETE /api/art/:id              # Delete artwork (admin)
```

### Cart
```
GET    /api/cart                 # Get user cart
POST   /api/cart                 # Add/update cart item
POST   /api/cart/attach          # Attach cart to user after login
```

### Orders
```
GET    /api/orders               # Get user orders
POST   /api/orders               # Create new order
GET    /api/orders/:id           # Get order by ID
PATCH  /api/orders/:id           # Update order status (admin)
```

### Workshops
```
GET    /api/workshops            # Get all workshops
POST   /api/workshops            # Create workshop (admin)
PATCH  /api/workshops/:id        # Update workshop (admin)
DELETE /api/workshops/:id        # Delete workshop (admin)
```

### Admin
```
GET    /api/admin/dashboard      # Dashboard statistics
GET    /api/admin/users          # Get all users
PATCH  /api/admin/users/:id/block # Block/unblock user
```

---

## 🛠️ Available Scripts

### Backend (`rabuste-backend`)

```bash
npm run dev     # Start development server with nodemon
npm start       # Start production server
node seedAdmin.js    # Seed admin user
node seedArtwork.js  # Seed artwork collection
```

### Frontend (`rabuste-frontend`)

```bash
npm run dev     # Start development server
npm run build   # Build for production
npm start       # Start production server
npm run lint    # Run ESLint
```

---

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Backend
PORT=5002 npm run dev

# Frontend
npm run dev -- -p 3001
```

#### Backend Not Running Error
```
Error: Failed to fetch
```

**Solution**: Make sure the backend server is running on port 5001
```bash
cd rabuste-backend
npm run dev
```

#### MongoDB Connection Error
```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB service
# macOS (with Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongodb

# Windows
net start MongoDB
```

#### Module Not Found
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

#### Authentication Issues
- Check if `JWT_SECRET` is set in `.env`
- Verify `NEXT_PUBLIC_API_URL` matches backend URL
- Clear browser localStorage and cookies

---

## 🚢 Deployment

### Backend (Render / Railway / Heroku)

1. **Set Environment Variables** in your hosting platform
2. **Update CORS settings** in `src/app.js` to allow your frontend domain
3. **Deploy** using Git or CLI

```bash
# Example for Render
git push origin main  # Auto-deploys on push
```

### Frontend (Vercel / Netlify)

1. **Connect GitHub repository**
2. **Set environment variables**:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.com
   MONGODB_URI=your_mongodb_connection_string
   ```
3. **Deploy** automatically on push to main branch

### Database (MongoDB Atlas)

1. Create a cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Add your deployment IP to whitelist
3. Update `MONGODB_URI` in both frontend and backend `.env` files

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] User registration and login
- [ ] Email verification flow
- [ ] Browse menu with filters
- [ ] Add items to cart
- [ ] Checkout process
- [ ] Order tracking with real-time updates
- [ ] Play interactive games
- [ ] View completed orders
- [ ] Admin login
- [ ] Admin dashboard analytics
- [ ] Menu/gallery management
- [ ] Order status updates
- [ ] Workshop creation

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### 1. Fork the Repository
```bash
git clone https://github.com/YOUR_USERNAME/Rabuste-GWOC.git
cd Rabuste
```

### 2. Create a Feature Branch
```bash
git checkout -b feature/amazing-feature
```

### 3. Make Your Changes
- Follow existing code style
- Write clear commit messages
- Test your changes thoroughly

### 4. Commit and Push
```bash
git add .
git commit -m "Add: amazing feature description"
git push origin feature/amazing-feature
```

### 5. Create Pull Request
- Describe your changes clearly
- Reference any related issues
- Wait for review

### Code Style Guidelines

- Use **TypeScript** for type safety
- Follow **ESLint** rules
- Use **Tailwind CSS** for styling (no inline styles)
- Write **descriptive variable names**
- Add **comments** for complex logic

---

## 👥 Team

This project was built with ❤️ by:

<table>
  <tr>
    <td align="center">
      <img src="" width="100px;" alt=""/>
      <br />
      <sub><b>Samanvitha Bolisetty</b></sub>
      <br />
      <a href="" title="GitHub">🔧</a>
    </td>
    <td align="center">
      <img src="https://github.com/Ojas-Srivastava05.png" width="100px;" alt=""/>
      <br />
      <sub><b>Ojas Srivastava</b></sub>
      <br />
      <a href="https://github.com/Ojas-Srivastava05" title="GitHub">🎨</a>
    </td>
    <td align="center">
      <img src="https://github.com/suniljaat.png" width="100px;" alt=""/>
      <br />
      <sub><b>Sunil Jaat</b></sub>
      <br />
      <a href="https://github.com/suniljaat" title="GitHub">💻</a>
    </td>
    <td align="center">
      <img src="https://github.com/ritweekraj.png" width="100px;" alt=""/>
      <br />
      <sub><b>Ritweek Raj</b></sub>
      <br />
      <a href="https://github.com/ritweekraj" title="GitHub">⚡</a>
    </td>
  </tr>
</table>

---

## 📄 License

Copyright © 2026 **RABUSTE**. All rights reserved.

This project is proprietary and confidential. Unauthorized copying, distribution, or use of this software is strictly prohibited.

---

## 📞 Support & Contact

### Need Help?

- 📧 **Email**: support@rabuste.com
- 🐛 **Report Issues**: [GitHub Issues](https://github.com/Ojas-Srivastava05/Rabuste-GWOC/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/Ojas-Srivastava05/Rabuste-GWOC/discussions)

### Social Media

- 🌐 **Website**: [www.rabuste.com](#)
- 📸 **Instagram**: [@rabuste.coffee](#)
- 🐦 **Twitter**: [@rabuste](#)

---

## 🙏 Acknowledgments

Special thanks to:

- **Next.js Team** for the amazing framework
- **Vercel** for hosting and deployment
- **MongoDB** for the database platform
- **Framer Motion** for beautiful animations
- **Three.js** for 3D capabilities
- **Open Source Community** for incredible tools

---

<div align="center">

### ⭐ Star this repository if you found it helpful!

**Made with ☕ and ❤️ by Team Rabuste**

</div>