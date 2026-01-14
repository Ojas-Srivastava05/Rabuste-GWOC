import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import connectDB from "@/src/lib/mongodb";
import Order from "@/src/models/Order";

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

    // Get all completed orders
    const orders = await Order.find({ status: "completed" });

    // Calculate Average Order Value (AOV)
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const averageAOV = orders.length > 0 ? totalRevenue / orders.length : 0;

    // Calculate Peak Time (hour with most orders)
    const hourCounts: { [key: number]: number } = {};
    orders.forEach((order) => {
      const hour = new Date(order.createdAt).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });

    let peakHour = 0;
    let maxCount = 0;
    Object.entries(hourCounts).forEach(([hour, count]) => {
      if (count > maxCount) {
        maxCount = count;
        peakHour = parseInt(hour);
      }
    });

    // Calculate Most Frequent Item
    const itemCounts: { [key: string]: { name: string; count: number; revenue: number } } = {};
    orders.forEach((order) => {
      order.items?.forEach((item: any) => {
        const itemName = item.name || item.itemId || "Unknown";
        if (!itemCounts[itemName]) {
          itemCounts[itemName] = { name: itemName, count: 0, revenue: 0 };
        }
        itemCounts[itemName].count += item.quantity || 1;
        itemCounts[itemName].revenue += (item.price || 0) * (item.quantity || 1);
      });
    });

    const mostFrequentItem = Object.values(itemCounts).sort((a, b) => b.count - a.count)[0] || null;

    // Additional stats
    const totalOrders = orders.length;
    const totalItems = orders.reduce((sum, order) => {
      return sum + (order.items?.reduce((itemSum: number, item: any) => itemSum + (item.quantity || 1), 0) || 0);
    }, 0);

    // Peak day of week
    const dayCounts: { [key: number]: number } = {};
    orders.forEach((order) => {
      const day = new Date(order.createdAt).getDay();
      dayCounts[day] = (dayCounts[day] || 0) + 1;
    });

    let peakDay = 0;
    let maxDayCount = 0;
    Object.entries(dayCounts).forEach(([day, count]) => {
      if (count > maxDayCount) {
        maxDayCount = count;
        peakDay = parseInt(day);
      }
    });

    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    return NextResponse.json({
      averageAOV: Math.round(averageAOV * 100) / 100,
      peakTime: {
        hour: peakHour,
        hour12: peakHour === 0 ? "12 AM" : peakHour < 12 ? `${peakHour} AM` : peakHour === 12 ? "12 PM" : `${peakHour - 12} PM`,
        count: maxCount,
      },
      peakDay: {
        day: peakDay,
        dayName: dayNames[peakDay],
        count: maxDayCount,
      },
      mostFrequentItem: mostFrequentItem ? {
        name: mostFrequentItem.name,
        count: mostFrequentItem.count,
        revenue: mostFrequentItem.revenue,
      } : null,
      totalOrders,
      totalRevenue,
      totalItems,
    });
  } catch (error: any) {
    console.error("Analytics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
