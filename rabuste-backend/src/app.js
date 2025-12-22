import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import protectedRoutes from "./routes/protected.js";

const app = express();

// logger
app.use((req, res, next) => {
  console.log("➡️", req.method, req.url);
  next();
});

// middleware
app.use(cors({
  origin: "http://localhost:3000",
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("Backend running");
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/franchise", franchiseRoutes);
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
