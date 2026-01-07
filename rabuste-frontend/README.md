# Rabuste Coffee - Premium Robusta Coffee E-Commerce Platform

A modern, full-stack e-commerce web application for Rabuste Coffee, featuring a bold design system, AI-powered recommendations, and seamless user experience.

## 🌟 Project Overview

Rabuste Coffee is an unapologetically bold coffee brand specializing in premium Robusta coffee with 2X the caffeine. This platform provides a complete digital experience for customers to explore, purchase, and learn about high-caffeine Robusta coffee.

## 🚀 Features

### Customer Features
- **Product Catalog**: Browse menu items with categories, search, and filters
- **AI-Powered Mood Brewer**: Get personalized coffee recommendations based on your mood
- **Art Gallery**: Browse and purchase coffee-related artwork
- **Workshops**: Discover and register for coffee and art workshops with calendar view
- **Real-time Order Tracking**: Track order status with interactive games while waiting
- **VR Experience**: 360° virtual tour of the coffee shop
- **User Authentication**: Secure login/signup with email verification
- **Shopping Cart**: Add items, apply coupons, and checkout seamlessly
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop

### Admin Features
- **Dashboard**: Overview of orders, users, and sales
- **Menu Management**: Add, edit, and remove menu items
- **Workshop Management**: Create and manage workshops
- **Order Management**: View and update order statuses
- **Gallery Management**: Manage art gallery items
- **User Management**: View and manage user accounts
- **Coupon System**: Create and manage discount coupons
- **AI Settings**: Configure AI recommendation parameters

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **State Management**: Zustand
- **HTTP Client**: Native Fetch API

### Backend
- **Runtime**: Node.js v20
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Email**: Nodemailer
- **Environment**: dotenv

## 📁 Project Structure

```
rabuste-frontend/
├── app/                          # Next.js app directory
│   ├── (routes)/
│   │   ├── page.tsx             # Landing page
│   │   ├── menu/                # Menu browsing
│   │   ├── art/                 # Art gallery
│   │   ├── workshops/           # Workshop listings
│   │   ├── cart/                # Shopping cart
│   │   ├── checkout/            # Checkout process
│   │   ├── order-status/        # Order tracking
│   │   ├── auth/                # Authentication
│   │   ├── franchise/           # Franchise inquiries
│   │   ├── science/             # Science of Robusta
│   │   └── moodBrewer/          # AI mood recommendations
│   ├── admin/                    # Admin panel
│   ├── api/                      # API routes
│   ├── globals.css              # Global styles
│   └── layout.tsx               # Root layout
├── components/                   # React components
│   ├── sections/                # Landing page sections
│   ├── Navbar.tsx               # Navigation
│   ├── Footer.tsx               # Footer
│   └── ...                      # Other components
├── contexts/                     # React contexts
├── lib/                          # Utility functions
└── public/                       # Static assets

rabuste-backend/
├── src/
│   ├── models/                  # Mongoose models
│   ├── config/                  # Configuration files
│   ├── utils/                   # Utility functions
│   └── app.js                   # Express app setup
├── server.js                    # Server entry point
└── .env                         # Environment variables
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js v20 or higher
- MongoDB installed and running
- npm or yarn package manager

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd rabuste-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root of `rabuste-backend`:
   ```env
   PORT=5001
   MONGODB_URI=mongodb://localhost:27017/rabuste
   JWT_SECRET=your_jwt_secret_key_here
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_app_password
   FRONTEND_URL=http://localhost:3000
   ```

4. **Seed admin user (optional)**
   ```bash
   node seedAdmin.js
   ```

5. **Start the backend server**
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:5001`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd rabuste-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env.local` file in the root of `rabuste-frontend`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5001
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:3000`

## 📝 Environment Variables

### Backend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Backend server port | `5001` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/rabuste` |
| `JWT_SECRET` | Secret key for JWT tokens | `your_secret_key` |
| `EMAIL_USER` | Email address for sending emails | `your_email@gmail.com` |
| `EMAIL_PASS` | Email app password | `your_app_password` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |

### Frontend (.env.local)
| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:5001` |

## 🎨 Design System

### Color Palette
- **Primary Copper**: `#B87333`
- **Bronze**: `#CD7F32`
- **Golden**: `#D4A574`
- **Warm White**: `#FFFEF9`
- **Background Dark**: `#1A1110`
- **Background Black**: `#000000`

### Typography
- **Headings**: Bebas Neue (400 weight)
- **Body**: Work Sans (300-900 weight)

### Component Patterns
All pages follow consistent patterns:
- Background gradient: `linear-gradient(180deg, #1A1110 0%, #000000 50%, #1A1110 100%)`
- Section labels: Simple gradient lines with uppercase text
- Heading letter-spacing: `0.05em`
- Label letter-spacing: `0.3em`

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-email` - Email verification

### Products
- `GET /api/menu` - Get all menu items
- `GET /api/gallery` - Get all art items

### Cart & Orders
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `DELETE /api/cart` - Clear cart
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders

### Workshops
- `GET /api/workshops` - Get all workshops
- `POST /api/workshops/:id/register` - Register for workshop

### Coupons
- `POST /api/coupons/validate` - Validate coupon code
- `POST /api/cart/apply-coupon` - Apply coupon to cart

### Admin (Protected)
- `GET /api/admin/orders` - Get all orders
- `PATCH /api/admin/orders/:id/status` - Update order status
- `POST /api/admin/menu` - Add menu item
- `PUT /api/admin/menu/:id` - Update menu item
- `DELETE /api/admin/menu/:id` - Delete menu item

## 🧪 Testing

### Running Tests
```bash
# Frontend tests
cd rabuste-frontend
npm test

# Backend tests
cd rabuste-backend
npm test
```

## 📦 Building for Production

### Frontend
```bash
cd rabuste-frontend
npm run build
npm start
```

### Backend
```bash
cd rabuste-backend
# Set NODE_ENV=production in .env
npm start
```

## 🚢 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Railway/Render)
1. Connect your GitHub repository
2. Set environment variables
3. Configure build command: `npm install`
4. Configure start command: `npm start`

### Database (MongoDB Atlas)
1. Create a MongoDB Atlas cluster
2. Get connection string
3. Update `MONGODB_URI` in backend environment

## 🔒 Security Considerations

- JWT tokens for authentication
- Password hashing with bcrypt
- HTTP-only cookies for session management
- CORS configured for specific origins
- Input validation and sanitization
- Rate limiting on sensitive endpoints
- Secure environment variable management

## 🎯 Key Features Implementation

### AI Mood Brewer
- Uses AI to analyze user mood inputs
- Recommends coffee based on energy needs, mood, and preferences
- Contextual suggestions based on time of day

### Order Tracking with Games
- Real-time order status updates
- Interactive mini-games while waiting
- Coffee facts and tips rotation
- Distance-based delivery ETA (if location enabled)

### VR Experience
- 360° panoramic view of coffee shop
- Interactive hotspots
- Immersive navigation

### Admin Dashboard
- Real-time statistics
- Order management with status updates
- Inventory control
- User management
- Coupon creation and tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is proprietary and confidential. All rights reserved by Rabuste Coffee.

## 👥 Team

- **Project Lead**: Rabuste Coffee Team
- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB
- **Design**: Custom Brutalist Design System

## 📞 Support

For issues, questions, or suggestions:
- Email: hello@rabuste.com
- Phone: +91 123 456 7890
- Location: Jodhpur, Rajasthan

## 🔄 Version History

### v1.0.0 (Current)
- Initial release
- Full e-commerce functionality
- Admin dashboard
- AI mood recommendations
- Workshop management
- VR experience

---

**Rabuste Coffee** - Unapologetically Bold | Built with ❤️ and ☕