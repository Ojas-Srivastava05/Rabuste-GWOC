import { NextResponse } from "next/server";
import connectDB from "@/src/lib/mongodb";
import Menu from "@/src/models/Menu";
import { Types } from "mongoose";

export async function DELETE(
    _req: Request,
    context: { params: Promise<{ id: string }> }
  ) {
    const { id } = await context.params;
  
    try {
      console.log("🟥 DELETE called with id:", id);
  
      await connectDB();
  
      const result = await Menu.findByIdAndDelete(id);
  
      console.log("🟥 Delete result:", result);
  
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("❌ Delete error:", error);
      return NextResponse.json(
        { error: "Failed to delete item" },
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
  
      const updated = await Menu.findByIdAndUpdate(
        id,
        { isAvailable: body.isAvailable },
        { new: true }
      );
  
      return NextResponse.json(updated);
    } catch (error) {
      console.error("Update error:", error);
      return NextResponse.json(
        { error: "Failed to update item" },
        { status: 500 }
      );
    }
  }
  