import { NextResponse } from "next/server";
import connectDB from "@/src/lib/mongodb";
import Art from "@/src/models/Art";

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    console.log("🟥 DELETE Art called with id:", id);

    await connectDB();

    const result = await Art.findByIdAndDelete(id);

    console.log("🟥 Delete result:", result);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete art item" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    await connectDB();

    const body = await req.json();

    const updated = await Art.findByIdAndUpdate(
      id,
      body,
      { new: true }
    );

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: "Failed to update art item" },
      { status: 500 }
    );
  }
}

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    await connectDB();

    const art = await Art.findById(id);

    if (!art) {
      return NextResponse.json(
        { error: "Art item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(art);
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch art item" },
      { status: 500 }
    );
  }
}