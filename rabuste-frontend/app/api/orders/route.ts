import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import connectDB from "@/src/lib/mongodb";
import Order from "@/src/models/Order";



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

    const data = await req.json();

    if (!data.items?.length || !data.totalAmount) {
      return NextResponse.json(
        { error: "Missing order data" },
        { status: 400 }
      );
    }

    const order = await Order.create({
      userId,
      customerName: decoded.name || "Customer",
      customerEmail: decoded.email || "unknown@email",
      items: data.items,
      totalAmount: data.totalAmount,
      instructions: data.instructions,
    });

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
