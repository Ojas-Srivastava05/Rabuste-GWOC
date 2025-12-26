export default function adminMiddleware(req, res, next) {
  try {
    // If authMiddleware runs before this, it should attach req.user
    // Accept either role === 'admin' or an isAdmin flag for flexibility
    const user = req.user || null;

    if (!user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (user.role === "admin" || user.isAdmin === true) {
      return next();
    }

    return res.status(403).json({ message: "Admin privileges required" });
  } catch (err) {
    console.error("adminMiddleware error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}