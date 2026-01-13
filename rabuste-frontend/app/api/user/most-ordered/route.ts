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
    const orders = await Order.find({ userId });

    // Count item occurrences
    const itemCounts = new Map<string, number>();
    orders.forEach(order => {
      order.items.forEach((item: any) => {
        const count = itemCounts.get(item.itemId) || 0;
        itemCounts.set(item.itemId, count + item.quantity);
      });
    });

    // Sort by count and get top items
    const sortedItems = Array.from(itemCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    // Fetch menu details for top items
    const items = await Promise.all(
      sortedItems.map(async ([itemId, count]) => {
        const menuItem = await Menu.findById(itemId);
        if (!menuItem) return null;

        return {
          ...menuItem.toObject(),
          orderCount: count,
        };
      })
    );

    // Filter out null values
    const validItems = items.filter(item => item !== null);

    return NextResponse.json({ items: validItems });
  } catch (error) {
    console.error("Most ordered fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch most ordered items" },
      { status: 500 }
    );
  }
}