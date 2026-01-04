import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Workshop from "@/src/models/Workshop";
import connectDB from "@/src/lib/mongodb";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { error: "Invalid workshop ID" },
      { status: 400 }
    );
  }

  await connectDB();

  try {
    const { name, email } = await req.json();

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    const workshop = await Workshop.findById(id);

    if (!workshop) {
      return NextResponse.json(
        { error: "Workshop not found" },
        { status: 404 }
      );
    }

    // Check if capacity is reached
    if (
      workshop.capacity > 0 &&
      workshop.registrations.length >= workshop.capacity
    ) {
      return NextResponse.json(
        { error: "Workshop is full" },
        { status: 400 }
      );
    }

    // Check if user already registered
    const alreadyRegistered = workshop.registrations.some(
      (reg: { email: string }) => reg.email === email
    );

    if (alreadyRegistered) {
      return NextResponse.json(
        { error: "You are already registered for this workshop" },
        { status: 400 }
      );
    }

    workshop.registrations.push({ name, email, registeredAt: new Date() });
    await workshop.save();

    return NextResponse.json({
      message: "Registration successful",
      workshop,
    });
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json(
      { error: "Failed to register" },
      { status: 500 }
    );
  }
}