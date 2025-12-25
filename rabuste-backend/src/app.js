import express from "express";
import cors from "cors";

/*}
import authRoutes from "./routes/auth.js";
import protectedRoutes from "./routes/protected.js";
import franchiseRoutes from "./routes/franchise.js";
import menuRoutes from "./routes/menu.js";
*/
import adminRoutes from "./routes/admin.routes.js";
import adminMenuRoutes from "./routes/admin.menu.routes.js";
import adminMenuRoutes from "./routes/admin.menu.routes.js";
import adminArtworkRoutes from "./routes/admin.artwork.routes.js";
import adminWorkshopRoutes from "./routes/admin.workshop.routes.js";



app.use("/api/admin",adminRoutes);
app.use("/api/admin",adminMenuRoutes);
app.use("/api/admin", adminMenuRoutes);
app.use("/api/admin", adminArtworkRoutes);
app.use("/api/admin", adminWorkshopRoutes);


/*
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
app.use("/menu", menuRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/franchise", franchiseRoutes);

export default app; 
*/