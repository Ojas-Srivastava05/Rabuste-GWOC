import { NextResponse } from "next/server";
import connectDB from "@/src/lib/mongodb";
import Order from "@/src/models/Order";


export async function POST(req: Request) {
  await connectDB(); // connect to MongoDB

  try {
    const data = await req.json();

    if (!data.customerName || !data.customerEmail || !data.items?.length) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const order = await Order.create({
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      items: data.items,
      totalAmount: data.totalAmount,
    });

    return NextResponse.json(order, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  await connectDB();

  try {
    const orders = await Order.find().sort({ createdAt: -1 });
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
