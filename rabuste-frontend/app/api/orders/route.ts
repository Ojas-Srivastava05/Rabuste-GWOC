import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import connectDB from "@/src/lib/mongodb";
import Order from "@/src/models/Order";
import User from "@/src/models/Users";
import { sendOrderConfirmation } from "@/src/lib/email";



export async function POST(req: Request) {
  await connectDB();

  try {
    // 🔥 FIX: read header from req
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET!
    );

    const userId = decoded.id;

    // Fetch user data from database
    const user = await User.findById(userId).select('name email');
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const data = await req.json();

    if (!data.items?.length || !data.totalAmount) {
      return NextResponse.json(
        { error: "Missing order data" },
        { status: 400 }
      );
    }

    const order = await Order.create({
      userId,
      customerName: user.name,
      customerEmail: user.email,
      items: data.items,
      totalAmount: data.totalAmount,
      instructions: data.instructions,
    });

    // Send premium order confirmation email (non-blocking)
    sendOrderConfirmation(user.email, {
      customerName: user.name,
      items: order.items,
      totalAmount: order.totalAmount,
      instructions: order.instructions,
      orderId: order._id.toString(),
    }).catch(err => console.error("Email failed:", err));

    return NextResponse.json(order, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}



export async function GET(req: Request) {
  await connectDB();

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET!
    );
    const isAdmin = decoded.role === "admin" || decoded.isAdmin === true;
    const query = isAdmin ? {} : { userId: decoded.id };

    const orders = await Order.find(query).sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


export async function PATCH(req: Request) {
  await connectDB();

  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();
    const data = await req.json();

    if (!id || !data.status) {
      return NextResponse.json({ error: "Missing ID or status" }, { status: 400 });
    }

    const updated = await Order.findByIdAndUpdate(
      id,
      { status: data.status },
      { new: true }
    );

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
