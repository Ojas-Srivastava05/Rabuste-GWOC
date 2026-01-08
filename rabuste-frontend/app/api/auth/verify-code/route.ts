import { NextResponse } from "next/server";
import User from "@/src/models/Users";
import { connectDB } from "@/src/lib/db";

export async function POST(req: Request) {
  await connectDB();
  const { email, code } = await req.json();

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 400 });
  }

  if (
    user.verificationCode !== code ||
    user.verificationCodeExpiry < Date.now()
  ) {
    return NextResponse.json({ message: "Invalid or expired code" }, { status: 400 });
  }

  user.isVerified = true;
  user.verificationCode = undefined;
  user.verificationCodeExpiry = undefined;
  await user.save();

  return NextResponse.json({ message: "Email verified" });
}
