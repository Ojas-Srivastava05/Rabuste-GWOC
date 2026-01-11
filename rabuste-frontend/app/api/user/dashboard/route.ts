import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/src/lib/db";
import Order from "@/src/models/Order";
import Menu from "@/src/models/Menu";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // Get token from Authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const userId = decoded.id;

    // Fetch user's orders
    const orders = await Order.find({ userId }).sort({ createdAt: -1 }).limit(10);

    // Calculate stats
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    // Get favorite items count from localStorage (client-side)
    const favoriteItems = 0; // This will be calculated on client side

    // Find most ordered item
    const itemCounts = new Map<string, number>();
    orders.forEach(order => {
      order.items.forEach((item: any) => {
        const count = itemCounts.get(item.itemId) || 0;
        itemCounts.set(item.itemId, count + item.quantity);
      });
    });

    let mostOrderedItem;
    if (itemCounts.size > 0) {
      const [mostOrderedId, count] = Array.from(itemCounts.entries()).sort((a, b) => b[1] - a[1])[0];
      const menuItem = await Menu.findById(mostOrderedId);
      if (menuItem) {
        mostOrderedItem = {
          name: menuItem.name,
          count: count,
        };
      }
    }

    return NextResponse.json({
      stats: {
        totalOrders,
        totalSpent,
        favoriteItems,
        mostOrderedItem,
      },
      recentOrders: orders.slice(0, 5),
    });
  } catch (error) {
    console.error("Dashboard fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}