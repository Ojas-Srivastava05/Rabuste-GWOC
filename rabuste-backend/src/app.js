import express from "express";
import cors from "cors";


import authRoutes from "./routes/auth.js";
import protectedRoutes from "./routes/protected.js";

// import menuRoutes from "./routes/menu.js";
const app = express();
import franchiseRoutes from "./routes/franchise.js";
import adminRoutes from "./routes/admin.routes.js";
import adminMenuRoutes from "./routes/admin.menu.routes.js";
// import adminArtworkRoutes from "./routes/admin.artwork.routes.js";
import adminWorkshopRoutes from "./routes/admin.workshop.routes.js";
import orderRoutes from "./routes/order.routes.js";
import aiDiscountRoutes from "./routes/ai-discount.js";

// middleware
// Allow both localhost (dev) and production frontend URL
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:54642",
  "https://rabuste-gwoc.vercel.app",
  process.env.FRONTEND_URL, // Additional production URL from env
].filter(Boolean); // Remove undefined values

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`⚠️ CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
}));

app.use(express.json());

// logger
app.use((req, res, next) => {
  console.log("➡️", req.method, req.url);
  if (req.method === 'PATCH' && req.url.includes('/ai-config')) {
    console.log("Request headers:", req.headers);
    console.log("Request body:", req.body);
  }
  next();
});

// test route
app.get("/", (req, res) => {
  res.send("Backend running");
});

// Health check endpoint for backend warming
app.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    uptime: process.uptime() 
  });
});

// routes
// app.use("/menu", menuRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/franchise", franchiseRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/admin",adminMenuRoutes);
// app.use("/api/admin", adminArtworkRoutes);
app.use("/api/admin", adminWorkshopRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/ai-discount", aiDiscountRoutes);
export default app; 
