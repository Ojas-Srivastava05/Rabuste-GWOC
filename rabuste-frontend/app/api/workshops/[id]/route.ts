import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Workshop from "@/src/models/Workshop";
import connectDB from "@/src/lib/mongodb";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  console.log('PUT received id:', id);

  await connectDB();

  try {
    const data = await req.json();
    delete data._id; // Mongo doesn’t like updating _id

    const updated = await Workshop.findByIdAndUpdate(id, data, { new: true });
    if (!updated) return NextResponse.json({ error: "Workshop not found" }, { status: 404 });

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  console.log('DELETE received id:', id);

  await connectDB();

  try {
    const deleted = await Workshop.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: "Workshop not found" }, { status: 404 });

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
