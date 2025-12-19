import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Workshop from "@/src/models/Workshop";
import connectDB from "@/src/lib/mongodb";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ REQUIRED

  console.log("PUT received id:", id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { error: "Invalid workshop ID" },
      { status: 400 }
    );
  }

  await connectDB();

  try {
    const data = await req.json();
    delete data._id;

    const updated = await Workshop.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json(
        { error: "Workshop not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (err) {
    console.error("PUT error:", err);
    return NextResponse.json(
      { error: "Update failed" },
      { status: 500 }
    );
  }
}


export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ THIS IS THE FIX

  console.log("DELETE received id:", id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { error: "Invalid workshop ID" },
      { status: 400 }
    );
  }

  await connectDB();

  const deleted = await Workshop.findByIdAndDelete(id);

  if (!deleted) {
    return NextResponse.json(
      { error: "Workshop not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(
    { message: "Deleted successfully" },
    { status: 200 }
  );
}