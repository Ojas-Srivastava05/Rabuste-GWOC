import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import connectDB from "../../../../src/lib/mongodb";
import User from "../../../../src/models/Users";
import Order from "../../../../src/models/Order";

export async function GET(req: Request) {
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

    // Get all users with order statistics
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    // Get order statistics for each user
    const usersWithStats = await Promise.all(
      users.map(async (user: any) => {
        const orders = await Order.find({ userId: user._id, status: "completed" });
        const totalOrderValue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        const orderCount = orders.length;

        return {
          ...user,
          totalOrderValue,
          orderCount,
          orderFrequency: orderCount === 1 ? "once" : orderCount === 2 ? "twice" : orderCount > 2 ? "multiple" : "none",
        };
      })
    );

    return NextResponse.json(usersWithStats);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
