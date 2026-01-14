import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import connectDB from "../../../../../src/lib/mongodb";
import User from "../../../../../src/models/Users";
import Order from "../../../../../src/models/Order";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectDB();

    const { id } = await params;
    const user = await User.findById(id).select("-password");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get order statistics
    const orders = await Order.find({ userId: id, status: "completed" });
    const totalOrderValue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const orderCount = orders.length;
    const orderFrequency = orderCount === 1 ? "once" : orderCount === 2 ? "twice" : orderCount > 2 ? "multiple" : "none";

    // Get all orders (including pending)
    const allOrders = await Order.find({ userId: id })
      .sort({ createdAt: -1 })
      .limit(10);

    return NextResponse.json({
      ...user.toObject(),
      totalOrderValue,
      orderCount,
      orderFrequency,
      recentOrders: allOrders,
    });
  } catch (error: any) {
    console.error("Get user details error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user details" },
      { status: 500 }
    );
  }
}
