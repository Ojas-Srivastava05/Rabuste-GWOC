import jwt from "jsonwebtoken";

export default function adminMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin" && decoded.isAdmin !== true) {
      return res.status(403).json({ message: "Admin privileges required" });
    }

    req.user = decoded; 
    next();
  } catch (err) {
    console.error("adminMiddleware error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
