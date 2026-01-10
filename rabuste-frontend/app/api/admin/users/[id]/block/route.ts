import { NextResponse, NextRequest } from "next/server";
import connectDB from "../../../../../../src/lib/mongodb";
import User from "../../../../../../src/models/Users";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const { block } = await request.json();

    const user = await User.findByIdAndUpdate(
      id,
      { isBlocked: block },
      { new: true }
    ).select("-password");

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error blocking/unblocking user:", error);
    return NextResponse.json(
      { message: "Failed to update user status" },
      { status: 500 }
    );
  }
}
