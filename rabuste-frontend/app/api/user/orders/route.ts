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

    // Fetch user's orders with menu item details
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    // Enrich orders with menu item details
    const enrichedOrders = await Promise.all(
      orders.map(async (order) => {
        const enrichedItems = await Promise.all(
          order.items.map(async (item: any) => {
            const menuItem = await Menu.findById(item.itemId);
            return {
              ...item.toObject(),
              name: menuItem?.name,
              price: menuItem?.price,
            };
          })
        );

        return {
          ...order.toObject(),
          items: enrichedItems,
        };
      })
    );

    return NextResponse.json({ orders: enrichedOrders });
  } catch (error) {
    console.error("Orders fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}