import { NextResponse } from "next/server";
import connectDB from "@/src/lib/mongodb";
import { Workshop } from "@/src/models/Workshop";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await req.json();

    const updatedWorkshop = await Workshop.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    );

    if (!updatedWorkshop) {
      return NextResponse.json(
        { error: "Workshop not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedWorkshop);
  } catch (error) {
    console.error("❌ PUT /api/workshops/[id] failed:", error);
    return NextResponse.json(
      { error: "Failed to update workshop" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const deletedWorkshop = await Workshop.findByIdAndDelete(params.id);

    if (!deletedWorkshop) {
      return NextResponse.json(
        { error: "Workshop not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ DELETE /api/workshops/[id] failed:", error);
    return NextResponse.json(
      { error: "Failed to delete workshop" },
      { status: 500 }
    );
  }
}
