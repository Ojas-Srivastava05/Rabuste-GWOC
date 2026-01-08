import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/src/models/Users";
import { connectDB } from "@/src/lib/db";

export async function POST(req: Request) {
  await connectDB();
  const { email, code, newPassword } = await req.json();

  const user = await User.findOne({ email });

  if (
    !user ||
    user.resetPasswordCode !== code ||
    !user.resetPasswordExpiry ||
    user.resetPasswordExpiry < new Date()
  ) {
    return NextResponse.json(
      { message: "Invalid or expired reset code" },
      { status: 400 }
    );
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetPasswordCode = undefined;
  user.resetPasswordExpiry = undefined;
  await user.save();

  return NextResponse.json({
    message: "Password reset successful",
  });
}
