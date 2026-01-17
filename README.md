<div align="center">

# ☕️ RABUSTE

### *Premium Coffee Experience Meets Digital Art Gallery*

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-9.0-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-5.2-000000?style=for-the-badge&logo=express)](https://expressjs.com/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)

**A revolutionary full-stack coffee shop and art gallery platform that blends premium coffee culture with digital art, powered by cutting-edge web technologies, AI-driven personalization, and immersive 3D experiences.**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [API Documentation](#-api-endpoints) • [Deployment](#-deployment) • [Contributing](#-contributing)

---

</div>

## 📋 Table of Contents

- [About Rabuste](#-about-rabuste)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Installation & Setup](#-installation--setup)
- [Configuration](#-configuration)
- [Usage Guide](#-usage-guide)
- [API Documentation](#-api-endpoints)
- [AI Features](#-ai-features)
- [Payment Integration](#-payment-integration)
- [Admin Dashboard](#-admin-dashboard)
- [Feedback System](#-feedback-system)
- [Deployment](#-deployment)
- [Testing](#-testing)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [Team](#-team)
- [License](#-license)

---

## 🎯 About Rabuste

**Rabuste** is a comprehensive, production-ready e-commerce platform that revolutionizes the coffee shop experience by combining:

- **☕ Premium Coffee Commerce** - Full-featured menu with 2X caffeine Robusta coffee, smart upselling, and AI-powered recommendations
- **🎨 Digital Art Gallery** - Curated artwork marketplace integrated seamlessly with the coffee shop experience
- **🤖 AI-Powered Personalization** - Mood-based coffee recommendations, intelligent upselling, and personalized combos
- **📦 Real-Time Order Tracking** - Live order status updates with interactive games and educational content
- **🎓 Workshop Management** - Complete event booking system with calendar views and capacity management
- **🥽 360° VR Experience** - Immersive virtual tour of the coffee shop using WebVR technology
- **📊 Advanced Analytics** - Firebase Analytics integration for data-driven insights
- **💬 AI Feedback System** - Automated sentiment analysis and feedback management
- **📸 Instagram Integration** - Auto-fetch and display Instagram posts
- **💳 Secure Payments** - Razorpay integration with server-side verification

Built with modern web technologies, Rabuste delivers a premium user experience with brutal design aesthetics, smooth animations, and responsive layouts across all devices.

---

## ✨ Key Features

### 🛍️ Customer-Facing Features

#### **Coffee & Beverage Menu**
- ✅ **Smart Search & Filters** - Find items by category, price range, name, or tags
- ✅ **Dynamic Upselling** - AI-powered premium alternative suggestions (triggers every 3rd item)
- ✅ **Real-time Inventory** - Live stock indicators, "sold today" counters, and availability status
- ✅ **Bestsellers & Trending** - Discover popular items with visual badges
- ✅ **Multiple View Modes** - Toggle between grid and list views for comfortable browsing
- ✅ **AI Discount System** - Automatic discounts on low-selling items (admin-configurable)
- ✅ **Category Filtering** - Filter by coffee type, beverages, snacks, and more
- ✅ **Price Sorting** - Sort by price (low to high, high to low)

#### **Digital Art Gallery**
- ✅ **Curated Collections** - Browse artwork by category, artist, medium, and style
- ✅ **High-Quality Images** - Multiple image carousel for each artwork with zoom functionality
- ✅ **Detailed Information** - Complete artist bio, dimensions, year, medium, and pricing
- ✅ **Seamless Purchasing** - Unified cart system for both menu items and artwork
- ✅ **Artwork Search** - Search by artist name, title, or description
- ✅ **Category Navigation** - Easy filtering by art type (paintings, digital art, prints, etc.)

#### **AI-Powered Personalization**
- ✅ **Mood Brewer** - Personalized coffee recommendations based on current mood
- ✅ **Taste Preferences** - Recommendations based on flavor preferences (sweet, bitter, creamy, etc.)
- ✅ **Time-Based Suggestions** - Different recommendations for morning, afternoon, and evening
- ✅ **Smart Upselling** - Context-aware premium upgrade suggestions
- ✅ **Personalized Combos** - AI-generated beverage and snack pairings
- ✅ **Floating Mood Brewer** - Quick access widget available from anywhere on the site

#### **Interactive Order Experience**
- ✅ **Real-time Tracking** - Live order status updates every 5 seconds
- ✅ **Location-Based Estimates** - Distance calculation and estimated delivery time
- ✅ **Engagement Games** - Memory matching, coffee trivia, and quizzes while waiting
- ✅ **Coffee Facts & Tips** - Educational content about coffee culture during wait time
- ✅ **Order History** - View both active and completed orders with clear distinction
- ✅ **Status Notifications** - Visual and audio notifications for status changes
- ✅ **Estimated Wait Times** - Accurate preparation time calculations based on order complexity

#### **Workshop Booking System**
- ✅ **Event Calendar** - Visual calendar view with workshop dates highlighted
- ✅ **Dual View Modes** - Switch between calendar and list views
- ✅ **Category Filtering** - Filter by coffee workshops vs art workshops
- ✅ **Easy Registration** - Simple form with email validation and confirmation
- ✅ **Capacity Management** - Shows available spots and "full" status
- ✅ **Workshop Details** - Complete information about instructors, timing, content, and pricing
- ✅ **Google Calendar Integration** - Add workshops to personal calendar

#### **360° VR Experience**
- ✅ **Immersive Tour** - Virtual walkthrough of the coffee shop
- ✅ **Multiple Scenes** - Navigate between main counter, seating area, and art gallery
- ✅ **Interactive Hotspots** - Click to move between scenes seamlessly
- ✅ **Mobile Optimized** - Works on all devices including smartphones
- ✅ **Analytics Tracking** - Firebase Analytics integration for VR usage metrics

#### **User Authentication & Profile**
- ✅ **JWT-based Authentication** - Secure token-based login system
- ✅ **Email Verification** - Confirm email addresses before account activation
- ✅ **Password Recovery** - Secure password reset functionality
- ✅ **Profile Management** - Update personal information and preferences
- ✅ **Order History** - Complete order history with details and receipts
- ✅ **Guest Checkout** - Shop without registration, attach orders post-login
- ✅ **Session Management** - Persistent login with localStorage

### 🔐 Security Features

- ✅ **JWT Authentication** - Secure token-based authentication with 7-day expiration
- ✅ **Email Verification** - Required email confirmation before account activation
- ✅ **Password Hashing** - bcryptjs for secure password storage
- ✅ **Protected Routes** - Role-based access control (User/Admin)
- ✅ **CORS Configuration** - Secure cross-origin resource sharing
- ✅ **Payment Verification** - Server-side payment verification with Razorpay
- ✅ **Input Validation** - Server-side validation for all user inputs
- ✅ **SQL Injection Protection** - Mongoose ODM prevents injection attacks
- ✅ **XSS Protection** - Input sanitization and output encoding

### 👨‍💼 Admin Dashboard Features

#### **Analytics & Overview**
- ✅ **Dashboard Statistics** - Real-time overview of orders, revenue, and users
- ✅ **Revenue Tracking** - Daily, weekly, and monthly revenue reports
- ✅ **Order Analytics** - Most sold items, order trends, and customer insights
- ✅ **User Statistics** - Total users, active users, and user growth metrics
- ✅ **Performance Metrics** - Key performance indicators and business insights

#### **Menu Management**
- ✅ **Add Menu Items** - Create new items with images, descriptions, and pricing
- ✅ **Edit Items** - Update existing menu items with real-time changes
- ✅ **Delete Items** - Remove items from the menu
- ✅ **Category Management** - Organize items by categories
- ✅ **Inventory Tracking** - Monitor stock levels and availability
- ✅ **Bulk Operations** - Import/export menu items

#### **Gallery Management**
- ✅ **Add Artwork** - Upload artwork with multiple images and details
- ✅ **Edit Artwork** - Update artwork information and pricing
- ✅ **Delete Artwork** - Remove artwork from gallery
- ✅ **Artist Management** - Manage artist profiles and information
- ✅ **Category Organization** - Organize artwork by categories and styles

#### **Order Management**
- ✅ **View All Orders** - Complete order list with filtering and search
- ✅ **Update Order Status** - Change status from pending → preparing → ready → completed
- ✅ **Order Details** - View complete order information including items and customer
- ✅ **Order History** - Track all past orders with timestamps
- ✅ **Customer Information** - View customer details for each order

#### **Workshop Management**
- ✅ **Create Workshops** - Add new workshops with full details
- ✅ **Edit Workshops** - Update workshop information and capacity
- ✅ **Delete Workshops** - Remove workshops from the system
- ✅ **Capacity Management** - Set and monitor workshop capacity
- ✅ **Registration Management** - View and manage workshop registrations

#### **User Management**
- ✅ **View All Users** - Complete user list with search and filters
- ✅ **Block/Unblock Users** - Manage user access and permissions
- ✅ **User Details** - View complete user profile and order history
- ✅ **Role Management** - Assign admin roles to users

#### **Coupon System**
- ✅ **Create Coupons** - Generate discount codes with expiration dates
- ✅ **Edit Coupons** - Update coupon details and validity
- ✅ **Delete Coupons** - Remove expired or unused coupons
- ✅ **Usage Tracking** - Monitor coupon usage and effectiveness
- ✅ **Discount Types** - Percentage or fixed amount discounts

#### **AI Configuration**
- ✅ **Discount Settings** - Configure automatic discounts for low-selling items
- ✅ **Upselling Configuration** - Adjust AI upselling triggers and suggestions
- ✅ **Mood Brewer Settings** - Customize recommendation algorithms
- ✅ **Sentiment Analysis** - Configure feedback analysis parameters

#### **Feedback Management**
- ✅ **View All Feedback** - Complete feedback list with AI analysis
- ✅ **Sentiment Analysis** - Automated sentiment detection (positive/negative/neutral)
- ✅ **Priority Assignment** - Auto-assigned priority levels (urgent/high/medium/low)
- ✅ **Flagged Reviews** - Automatic flagging of negative reviews
- ✅ **Category Extraction** - Auto-detected feedback categories
- ✅ **Filtering & Search** - Filter by type, sentiment, priority, and flagged status
- ✅ **Statistics Dashboard** - Feedback statistics and insights

#### **Instagram Integration**
- ✅ **Auto-Fetch Posts** - Automatically fetch latest Instagram posts via API
- ✅ **Manual Posts** - Add Instagram posts manually as fallback
- ✅ **Post Management** - Edit, delete, and organize Instagram posts
- ✅ **Display Control** - Control which posts appear on the website

### 🎨 Design & UX Features

- ✅ **Brutal Design Language** - Bold, modern aesthetic with copper and bronze accents
- ✅ **Responsive Layout** - Perfect experience on desktop, tablet, and mobile
- ✅ **Smooth Animations** - Framer Motion powered transitions and micro-interactions
- ✅ **3D Elements** - Three.js for immersive visual experiences
- ✅ **Dynamic Backgrounds** - Interactive particle effects and gradients
- ✅ **Accessibility** - Keyboard navigation and screen reader support
- ✅ **Dark Theme** - Premium dark color scheme with warm accents
- ✅ **Loading States** - Beautiful loading animations and skeletons
- ✅ **Error Handling** - User-friendly error messages and fallbacks

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
| **A-Frame** | 1.7 | WebVR framework |
| **Razorpay** | 2.9 | Payment integration |
| **Firebase** | 12.7 | Analytics |
| **Cloudinary** | 2.9 | Image management |

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
| **Razorpay** | 2.9 | Payment processing |
| **crypto** | 1.0 | Cryptographic functions |

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **PostCSS** - CSS processing
- **Nodemon** - Auto-restart dev server
- **TypeScript** - Type checking

### Deployment & Infrastructure

- **Vercel** - Frontend hosting (recommended)
- **Render/Railway** - Backend hosting
- **MongoDB Atlas** - Cloud database
- **Cloudinary** - Image CDN
- **Firebase Analytics** - Analytics platform

---

## 🏗️ Project Architecture

```
Rabuste/
├── rabuste-backend/              # Express.js Backend API
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js            # MongoDB connection
│   │   │   ├── env.js           # Environment configuration
│   │   │   └── razorpay.js      # Razorpay configuration
│   │   ├── controllers/
│   │   │   ├── admin.controller.js
│   │   │   ├── art.controller.js
│   │   │   ├── artwork.controller.js
│   │   │   ├── instagram.controller.js
│   │   │   ├── menu.controller.js
│   │   │   ├── order.controller.js
│   │   │   ├── payment.controller.js
│   │   │   └── workshop.controller.js
│   │   ├── middleware/
│   │   │   ├── adminMiddleware.js
│   │   │   └── authMiddleware.js
│   │   ├── models/
│   │   │   ├── aiconfig.js      # AI configuration schema
│   │   │   ├── art.js           # Art schema
│   │   │   ├── feedback.js      # Feedback schema
│   │   │   ├── instagram.js     # Instagram posts schema
│   │   │   ├── menu.js          # Menu schema
│   │   │   ├── order.js         # Order schema
│   │   │   ├── store.js         # Store schema
│   │   │   ├── User.js          # User schema
│   │   │   └── workshop.js      # Workshop schema
│   │   ├── routes/
│   │   │   ├── admin.menu.routes.js
│   │   │   ├── admin.routes.js
│   │   │   ├── admin.workshop.routes.js
│   │   │   ├── ai-discount.js
│   │   │   ├── artwork.routes.js
│   │   │   ├── auth.js
│   │   │   ├── feedback.js
│   │   │   ├── franchise.js
│   │   │   ├── instagram.routes.js
│   │   │   ├── menu.js
│   │   │   ├── order.routes.js
│   │   │   ├── payment.routes.js
│   │   │   └── protected.js
│   │   ├── services/
│   │   │   ├── petpooja.service.js
│   │   │   └── reelo.service.js
│   │   ├── utils/
│   │   │   ├── distance.utils.js
│   │   │   ├── sendEmail.js
│   │   │   ├── sendWorkshopEmail.js
│   │   │   └── sentimentAnalysis.js  # AI sentiment analysis
│   │   └── app.js               # Express app configuration
│   ├── .env                     # Environment variables
│   ├── server.js                # Entry point
│   ├── seedAdmin.js             # Admin seeder script
│   ├── seedArtwork.js           # Artwork seeder script
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
│   │   ├── workshops/
│   │   │   └── page.tsx        # Workshops page
│   │   ├── admin/               # Admin dashboard
│   │   │   ├── page.tsx        # Admin dashboard
│   │   │   ├── menu/
│   │   │   ├── gallery/
│   │   │   ├── orders/
│   │   │   ├── workshops/
│   │   │   ├── users/
│   │   │   ├── coupons/
│   │   │   ├── feedback/
│   │   │   ├── instagram/
│   │   │   ├── ai-settings/
│   │   │   └── analytics/
│   │   ├── api/                 # API routes
│   │   │   ├── cart/
│   │   │   ├── menu/
│   │   │   ├── orders/
│   │   │   ├── payment/
│   │   │   └── ...
│   │   ├── layout.tsx          # Root layout
│   │   └── globals.css         # Global styles
│   │
│   ├── components/             # React components
│   │   ├── Navbar.tsx
│   │   ├── FloatingCart.tsx
│   │   ├── DynamicBackground.tsx
│   │   ├── MoodBrewer.tsx
│   │   ├── VRExperience.tsx
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
│   │   └── razorpay.ts
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

## 📦 Installation & Setup

### Prerequisites

Ensure you have the following installed:

- **Node.js** v20 or higher - [Download](https://nodejs.org/)
- **npm** v10 or higher (comes with Node.js)
- **MongoDB** - Local installation or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
- **Git** - [Download](https://git-scm.com/)

Verify your installations:

```bash
node --version  # Should be v20.x or higher
npm --version   # Should be 10.x or higher
mongod --version  # MongoDB version (if installed locally)
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
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rabuste?retryWrites=true&w=majority

# JWT Secret (use a strong random string - generate with: openssl rand -base64 32)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Email Configuration (for Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
# Note: For Gmail, use App Password, not regular password
# Generate at: https://myaccount.google.com/apppasswords

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Razorpay Configuration (for payments)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
# Get from: https://dashboard.razorpay.com/app/keys

# Cloudinary Configuration (for image uploads - optional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### 5. Seed Database (Optional)

Populate the database with sample data:

```bash
# Seed admin user (creates default admin account)
node seedAdmin.js

# Seed artwork collection (adds sample artwork)
node seedArtwork.js
```

**Default Admin Credentials** (after seeding):
- Email: `admin@rabuste.com`
- Password: `admin123` (change immediately in production!)

#### 6. Start Backend Server

```bash
# Development mode (with auto-restart via nodemon)
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

# Razorpay Configuration (for payments)
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
# Note: Only key_id is public, key_secret stays in backend

# MongoDB (for Next.js API routes - if using)
MONGODB_URI=mongodb://localhost:27017/rabuste
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rabuste

# NextAuth Configuration (if using NextAuth)
NEXTAUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=http://localhost:3000

# Firebase Configuration (for analytics - optional)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
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

## ⚙️ Configuration

### MongoDB Setup

#### Option 1: Local MongoDB

1. Install MongoDB locally:
   ```bash
   # macOS (with Homebrew)
   brew tap mongodb/brew
   brew install mongodb-community

   # Start MongoDB
   brew services start mongodb-community
   ```

2. Update `.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/rabuste
   ```

#### Option 2: MongoDB Atlas (Cloud)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Create database user
4. Whitelist your IP address (or use `0.0.0.0/0` for development)
5. Get connection string and update `.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rabuste?retryWrites=true&w=majority
   ```

### Email Configuration (Nodemailer)

#### Gmail Setup

1. Enable 2-Factor Authentication on your Google account
2. Generate App Password: [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Update `.env`:
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-16-char-app-password
   ```

#### Other Email Providers

Update SMTP settings in `.env` according to your provider's documentation.

### Razorpay Setup

1. Create account at [Razorpay](https://razorpay.com/)
2. Get API keys from [Dashboard](https://dashboard.razorpay.com/app/keys)
3. Update `.env` files:
   - Backend: `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`
   - Frontend: `NEXT_PUBLIC_RAZORPAY_KEY_ID`

### Firebase Analytics (Optional)

1. Create project at [Firebase Console](https://console.firebase.google.com/)
2. Add web app to project
3. Copy configuration values to `.env.local`

---

## 📖 Usage Guide

### Customer Flow

1. **Browse Menu** → Visit `/menu` to explore coffee and beverages
2. **Explore Art** → Visit `/art` to browse the digital gallery
3. **Use Mood Brewer** → Click Mood Brewer widget for personalized recommendations
4. **Add to Cart** → Select items and quantities
5. **View Cart** → Check cart contents and apply coupons
6. **Checkout** → Proceed to checkout (login required for order placement)
7. **Payment** → Complete payment via Razorpay
8. **Track Order** → Visit `/order-status` to see real-time updates
9. **Play Games** → Engage with trivia and games while waiting
10. **View Completed** → Scroll down on order status to see completed orders

### Admin Flow

1. **Login** → Use admin credentials at `/auth`
2. **Dashboard** → View analytics at `/admin`
3. **Manage Menu** → Add/edit items at `/admin/menu`
4. **Manage Gallery** → Update artwork at `/admin/gallery`
5. **Process Orders** → Handle orders at `/admin/orders`
6. **Manage Workshops** → Create events at `/admin/workshops`
7. **Manage Coupons** → Create discount codes at `/admin/coupons`
8. **View Feedback** → Review customer feedback at `/admin/feedback`
9. **Configure AI** → Adjust AI settings at `/admin/ai-settings`
10. **Manage Users** → View and manage users at `/admin/users`

---

## 🔌 API Endpoints

### Authentication

```
POST   /api/auth/signup          # Register new user
POST   /api/auth/login           # Login user
GET    /api/auth/verify-email    # Verify email token
POST   /api/auth/forgot-password # Request password reset
POST   /api/auth/reset-password  # Reset password with token
GET    /api/auth/me              # Get current user (protected)
```

### Menu

```
GET    /api/menu                 # Get all menu items
GET    /api/menu/:id             # Get single menu item
POST   /api/menu                 # Add menu item (admin)
PATCH  /api/menu/:id             # Update menu item (admin)
DELETE /api/menu/:id             # Delete menu item (admin)
GET    /api/menu/categories      # Get all categories
```

### Art Gallery

```
GET    /api/art                  # Get all artworks
GET    /api/art/:id              # Get single artwork
POST   /api/art                  # Add artwork (admin)
PATCH  /api/art/:id              # Update artwork (admin)
DELETE /api/art/:id              # Delete artwork (admin)
GET    /api/art/categories       # Get all art categories
```

### Cart

```
GET    /api/cart                 # Get user cart
POST   /api/cart                 # Add/update cart item
DELETE /api/cart/:id             # Remove cart item
POST   /api/cart/clear           # Clear cart
POST   /api/cart/attach          # Attach cart to user after login
POST   /api/cart/apply-coupon   # Apply coupon code
```

### Orders

```
GET    /api/orders               # Get user orders
POST   /api/orders               # Create new order
GET    /api/orders/:id           # Get order by ID
PATCH  /api/orders/:id           # Update order status (admin)
GET    /api/orders/active        # Get active orders
GET    /api/orders/completed     # Get completed orders
```

### Payment

```
POST   /api/payment/create-order # Create Razorpay order
POST   /api/payment/verify       # Verify payment signature
GET    /api/payment/status/:id   # Get payment status
```

### Workshops

```
GET    /api/workshops            # Get all workshops
GET    /api/workshops/:id        # Get single workshop
POST   /api/workshops            # Create workshop (admin)
PATCH  /api/workshops/:id        # Update workshop (admin)
DELETE /api/workshops/:id        # Delete workshop (admin)
POST   /api/workshops/:id/register # Register for workshop
```

### Feedback

```
POST   /api/feedback             # Submit feedback (public)
GET    /api/feedback             # Get all feedback (admin)
GET    /api/feedback/stats       # Get feedback statistics (admin)
GET    /api/feedback/:id         # Get single feedback (admin)
PATCH  /api/feedback/:id         # Update feedback (admin)
```

### Admin

```
GET    /api/admin/dashboard      # Dashboard statistics
GET    /api/admin/users           # Get all users
PATCH  /api/admin/users/:id/block # Block/unblock user
GET    /api/admin/analytics       # Advanced analytics
```

### Instagram

```
GET    /api/instagram            # Get Instagram posts (public)
POST   /api/instagram/admin/fetch # Fetch from Instagram API (admin)
POST   /api/instagram/admin/manual # Add manual post (admin)
PATCH  /api/instagram/admin/:id  # Update post (admin)
DELETE /api/instagram/admin/:id  # Delete post (admin)
```

### Coupons

```
GET    /api/coupons              # Get all coupons
POST   /api/coupons              # Create coupon (admin)
PATCH  /api/coupons/:id          # Update coupon (admin)
DELETE /api/coupons/:id          # Delete coupon (admin)
POST   /api/coupons/validate     # Validate coupon code
```

---

## 🤖 AI Features

### Mood Brewer

The AI Mood Brewer provides personalized coffee recommendations based on:

- **Current Mood** - Happy, stressed, tired, focused, relaxed
- **Taste Preferences** - Sweet, bitter, creamy, strong, mild
- **Time of Day** - Morning, afternoon, evening
- **Caffeine Needs** - High, medium, low

**How it works:**
1. User selects mood and preferences
2. AI algorithm matches preferences with menu items
3. Returns top 3 recommendations with explanations
4. User can add recommended items directly to cart

### Smart Upselling

- Triggers every 3rd item added to cart
- Suggests premium alternatives based on:
  - Current cart items
  - Price range
  - Category similarity
- Non-intrusive modal with clear value proposition

### AI Discount System

- Automatically applies discounts to low-selling items
- Admin-configurable discount percentage
- Visual badges on discounted items
- Tracks discount effectiveness

### Sentiment Analysis (Feedback System)

- **Automated Analysis** - Analyzes feedback comments and ratings
- **Sentiment Detection** - Positive, negative, or neutral
- **Score Calculation** - Sentiment score from -1 to 1
- **Auto-Flagging** - Flags negative reviews (rating ≤ 2)
- **Priority Assignment** - Urgent, high, medium, or low priority
- **Category Extraction** - Auto-detects feedback categories
- **Summary Generation** - Creates concise summaries

**Sentiment Analysis Algorithm:**
- Analyzes text for positive/negative keywords
- Combines text analysis (60%) with rating scores (40%)
- Returns sentiment classification and score

---

## 💳 Payment Integration

### Razorpay Integration

Rabuste uses Razorpay for secure payment processing with the following features:

- **Secure Payment Gateway** - PCI DSS compliant
- **Multiple Payment Methods** - Cards, UPI, Netbanking, Wallets
- **Server-Side Verification** - Payment signature verification on backend
- **Amount Validation** - Server-side amount verification to prevent tampering
- **Order Tracking** - Payment status linked to orders
- **Error Handling** - Comprehensive error handling and user feedback

### Payment Flow

1. User proceeds to checkout
2. Frontend creates Razorpay order via backend API
3. Backend validates cart amount and creates Razorpay order
4. User completes payment on Razorpay checkout
5. Frontend receives payment response
6. Backend verifies payment signature
7. Order is created and confirmed
8. User receives confirmation email

### Security Features

- ✅ Amount verification on server-side
- ✅ Payment signature verification
- ✅ Secure API key storage
- ✅ HTTPS-only communication
- ✅ No sensitive data in frontend

---

## 📊 Admin Dashboard

### Dashboard Overview

The admin dashboard provides comprehensive business insights:

- **Revenue Statistics** - Daily, weekly, monthly revenue
- **Order Analytics** - Total orders, pending, completed
- **User Statistics** - Total users, active users, growth
- **Most Sold Items** - Top-selling menu items
- **Performance Metrics** - Key performance indicators

### Management Features

#### Menu Management
- Add/edit/delete menu items
- Upload images (Cloudinary integration)
- Set pricing and categories
- Manage inventory
- Bulk operations

#### Gallery Management
- Add/edit/delete artwork
- Multiple image uploads
- Artist information management
- Pricing and availability
- Category organization

#### Order Management
- View all orders with filters
- Update order status
- View order details
- Customer information
- Order history tracking

#### Workshop Management
- Create/edit/delete workshops
- Set capacity and pricing
- Manage registrations
- Calendar view
- Email notifications

#### User Management
- View all users
- Block/unblock users
- View user details
- Order history per user
- Role management

#### Coupon Management
- Create discount codes
- Set expiration dates
- Track usage
- Percentage or fixed discounts
- Usage limits

#### Feedback Management
- View all feedback with AI analysis
- Filter by sentiment, priority, type
- Flag/unflag reviews
- Update priority
- View statistics

#### AI Configuration
- Configure discount system
- Adjust upselling triggers
- Mood Brewer settings
- Sentiment analysis parameters

---

## 💬 Feedback System

### Features

- **Multi-Type Feedback** - Order, Cafe, and Website feedback
- **AI Sentiment Analysis** - Automated sentiment detection
- **Auto-Flagging** - Flags negative reviews automatically
- **Priority Assignment** - Urgent, high, medium, low
- **Category Extraction** - Auto-detects feedback categories
- **Summary Generation** - AI-generated concise summaries
- **Advanced Filtering** - Filter by type, sentiment, priority, flagged
- **Statistics Dashboard** - Comprehensive feedback analytics

### Feedback Types

#### Order Feedback
- Overall rating
- Food quality rating
- Delivery time rating
- Packaging rating
- Comments

#### Cafe Feedback
- Overall rating
- Ambience rating
- Service rating
- Cleanliness rating
- Music rating
- Comments

#### Website Feedback
- Overall rating
- Ease of use rating
- Design rating
- Speed rating
- Features rating
- Comments

### AI Analysis Process

1. **Sentiment Analysis**
   - Analyzes comment text for positive/negative keywords
   - Combines with rating scores (60% text, 40% rating)
   - Returns sentiment: positive/negative/neutral
   - Score range: -1 (very negative) to 1 (very positive)

2. **Auto-Flagging**
   - Automatically flags when:
     - Sentiment is negative AND
     - Rating is ≤ 2 stars

3. **Priority Assignment**
   - **Urgent**: Negative sentiment + Rating ≤ 2
   - **High**: Negative sentiment + Rating ≤ 3
   - **Medium**: Neutral sentiment + Rating ≤ 3
   - **Low**: All others

4. **Category Extraction**
   - Order: food_quality, delivery, packaging, order_accuracy
   - Cafe: ambience, service, cleanliness, atmosphere
   - Website: usability, design, performance, features

5. **Summary Generation**
   - Extracts key ratings
   - Includes comment snippets
   - Type-specific formatting

---

## 🚢 Deployment

### Backend Deployment (Render / Railway / Heroku)

#### Render Deployment

1. **Create New Web Service**
   - Connect GitHub repository
   - Select `rabuste-backend` directory
   - Build command: `npm install`
   - Start command: `npm start`

2. **Set Environment Variables**
   ```
   PORT=5001
   NODE_ENV=production
   MONGODB_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_jwt_secret
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email
   EMAIL_PASSWORD=your_app_password
   FRONTEND_URL=https://your-frontend-domain.com
   RAZORPAY_KEY_ID=your_key_id
   RAZORPAY_KEY_SECRET=your_key_secret
   ```

3. **Deploy**
   - Push to main branch (auto-deploys)
   - Or manually deploy from dashboard

#### Railway Deployment

1. **Create New Project**
   - Connect GitHub repository
   - Select `rabuste-backend` directory

2. **Configure**
   - Set environment variables
   - Railway auto-detects Node.js

3. **Deploy**
   - Automatic deployment on push

### Frontend Deployment (Vercel / Netlify)

#### Vercel Deployment (Recommended)

1. **Connect Repository**
   - Import GitHub repository
   - Select `rabuste-frontend` directory

2. **Configure Build Settings**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`

3. **Set Environment Variables**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.com
   NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
   MONGODB_URI=your_mongodb_uri
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
   # ... other Firebase variables
   ```

4. **Deploy**
   - Automatic deployment on push to main
   - Preview deployments for pull requests

#### Netlify Deployment

1. **Connect Repository**
   - Import GitHub repository
   - Select `rabuste-frontend` directory

2. **Configure Build**
   - Build command: `npm run build`
   - Publish directory: `.next`

3. **Set Environment Variables**
   - Same as Vercel

4. **Deploy**
   - Automatic deployment on push

### Database Deployment (MongoDB Atlas)

1. **Create Cluster**
   - Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create free cluster (M0)

2. **Configure Security**
   - Create database user
   - Whitelist IP addresses (or `0.0.0.0/0` for all)

3. **Get Connection String**
   - Click "Connect" on cluster
   - Choose "Connect your application"
   - Copy connection string

4. **Update Environment Variables**
   - Replace `<password>` with actual password
   - Update `MONGODB_URI` in both frontend and backend

### Post-Deployment Checklist

- [ ] Backend is accessible and responding
- [ ] Frontend is loading correctly
- [ ] Database connection is working
- [ ] Authentication is functional
- [ ] Payment integration is working (test mode)
- [ ] Email service is configured
- [ ] CORS is properly configured
- [ ] Environment variables are set
- [ ] SSL certificates are active (HTTPS)
- [ ] Analytics are tracking correctly

---

## 🧪 Testing

### Manual Testing Checklist

#### Authentication
- [ ] User registration
- [ ] Email verification
- [ ] Login functionality
- [ ] Password reset
- [ ] Session persistence
- [ ] Logout functionality

#### Menu & Shopping
- [ ] Browse menu items
- [ ] Search functionality
- [ ] Filter by category
- [ ] Add items to cart
- [ ] Update quantities
- [ ] Remove items
- [ ] Apply coupons
- [ ] View cart total

#### Checkout & Payment
- [ ] Guest checkout
- [ ] Login during checkout
- [ ] Payment flow
- [ ] Payment verification
- [ ] Order confirmation
- [ ] Email notifications

#### Order Tracking
- [ ] Real-time status updates
- [ ] Active orders display
- [ ] Completed orders display
- [ ] Interactive games
- [ ] Coffee facts display

#### Admin Features
- [ ] Admin login
- [ ] Dashboard analytics
- [ ] Menu management
- [ ] Gallery management
- [ ] Order management
- [ ] Workshop management
- [ ] User management
- [ ] Coupon management
- [ ] Feedback management
- [ ] AI configuration

#### Art Gallery
- [ ] Browse artwork
- [ ] View artwork details
- [ ] Add to cart
- [ ] Search artwork
- [ ] Filter by category

#### Workshops
- [ ] View workshops
- [ ] Calendar view
- [ ] List view
- [ ] Register for workshop
- [ ] Email confirmation

#### VR Experience
- [ ] VR tour loads
- [ ] Scene navigation
- [ ] Hotspot interaction
- [ ] Mobile compatibility

---

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use

**Backend:**
```bash
# Change port in .env
PORT=5002 npm run dev
```

**Frontend:**
```bash
npm run dev -- -p 3001
```

#### Backend Not Running Error

**Error:** `Failed to fetch` or `Network error`

**Solution:**
1. Ensure backend is running on port 5001
2. Check `NEXT_PUBLIC_API_URL` in frontend `.env.local`
3. Verify CORS configuration in backend
4. Check backend logs for errors

```bash
cd rabuste-backend
npm run dev
```

#### MongoDB Connection Error

**Error:** `MongooseError: connect ECONNREFUSED`

**Solution:**

**Local MongoDB:**
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

**MongoDB Atlas:**
1. Verify connection string in `.env`
2. Check IP whitelist in Atlas dashboard
3. Verify database user credentials
4. Check network connectivity

#### Module Not Found

**Error:** `Cannot find module 'xyz'`

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Build Errors

**Frontend Build Errors:**
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

**TypeScript Errors:**
```bash
# Check TypeScript configuration
npx tsc --noEmit
```

#### Authentication Issues

**Error:** `Invalid token` or `Unauthorized`

**Solution:**
1. Check if `JWT_SECRET` is set in backend `.env`
2. Verify `NEXT_PUBLIC_API_URL` matches backend URL
3. Clear browser localStorage and cookies
4. Check token expiration (7 days default)

#### Payment Issues

**Error:** `Razorpay order creation failed`

**Solution:**
1. Verify Razorpay keys in both frontend and backend
2. Check Razorpay account status
3. Ensure using correct keys (test vs production)
4. Check backend payment verification logs

#### Email Not Sending

**Error:** `Email service error`

**Solution:**
1. Verify email credentials in `.env`
2. For Gmail, use App Password (not regular password)
3. Check SMTP settings
4. Verify network connectivity
5. Check email service logs

#### CORS Errors

**Error:** `CORS policy: No 'Access-Control-Allow-Origin'`

**Solution:**
1. Update `FRONTEND_URL` in backend `.env`
2. Check CORS configuration in `src/app.js`
3. Verify frontend URL matches exactly (including protocol)

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
- Update documentation if needed

### 4. Commit Your Changes

```bash
git add .
git commit -m "Add: amazing feature description"
```

**Commit Message Format:**
- `Add:` for new features
- `Fix:` for bug fixes
- `Update:` for updates to existing features
- `Refactor:` for code refactoring
- `Docs:` for documentation changes

### 5. Push to Your Fork

```bash
git push origin feature/amazing-feature
```

### 6. Create Pull Request

- Describe your changes clearly
- Reference any related issues
- Include screenshots if UI changes
- Wait for review

### Code Style Guidelines

- Use **TypeScript** for type safety
- Follow **ESLint** rules
- Use **Tailwind CSS** for styling (no inline styles)
- Write **descriptive variable names**
- Add **comments** for complex logic
- Follow **React best practices**
- Use **functional components** with hooks
- Implement **error boundaries** where needed

### Development Workflow

1. Create issue or pick existing issue
2. Fork repository
3. Create feature branch
4. Make changes
5. Test thoroughly
6. Update documentation
7. Create pull request
8. Address review comments
9. Merge when approved

---

## 👥 Team

This project was built with ❤️ by:

<table>
  <tr>
    <td align="center">
      <img src="https://github.com/Ojas-Srivastava05.png" width="100px;" alt="Ojas Srivastava"/>
      <br />
      <sub><b>Ojas Srivastava</b></sub>
      <br />
      <a href="https://github.com/Ojas-Srivastava05" title="GitHub">🎨</a>
    </td>
    <td align="center">
      <img src="https://github.com/suniljaat.png" width="100px;" alt="Sunil Jaat"/>
      <br />
      <sub><b>Sunil Jaat</b></sub>
      <br />
      <a href="https://github.com/suniljaat" title="GitHub">💻</a>
    </td>
    <td align="center">
      <img src="https://github.com/ritweekraj.png" width="100px;" alt="Ritweek Raj"/>
      <br />
      <sub><b>Ritweek Raj</b></sub>
      <br />
      <a href="https://github.com/ritweekraj" title="GitHub">⚡</a>
    </td>
    <td align="center">
      <img src="" width="100px;" alt="Samanvitha Bolisetty"/>
      <br />
      <sub><b>Samanvitha Bolisetty</b></sub>
      <br />
      <a href="" title="GitHub">🔧</a>
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
- **Razorpay** for payment integration
- **Firebase** for analytics
- **Open Source Community** for incredible tools

---

## 📚 Additional Resources

### Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Documentation](https://expressjs.com/)
- [Razorpay Documentation](https://razorpay.com/docs/)
- [Firebase Documentation](https://firebase.google.com/docs)

### Related Files

- [FEEDBACK_SYSTEM.md](./FEEDBACK_SYSTEM.md) - Detailed feedback system documentation
- [PRESENTATION.md](./PRESENTATION.md) - Presentation guide and demo script
- [INSTAGRAM_SETUP.md](./INSTAGRAM_SETUP.md) - Instagram integration setup guide

---

<div align="center">

### ⭐ Star this repository if you found it helpful!

**Made with ☕ and ❤️ by Team Rabuste**

[⬆ Back to Top](#-rabuste)

</div>
