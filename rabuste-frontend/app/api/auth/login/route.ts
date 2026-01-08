import { NextResponse } from "next/server";
import User from "@/src/models/Users";
import { connectDB } from "@/src/lib/db";
import { verifyPassword } from "@/src/lib/password";
import { signToken } from "@/src/lib/jwt";

export async function POST(req: Request) {
  await connectDB();
  const { email, password } = await req.json();

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 400 });
  }

  if (!user.isVerified && user.role !== "admin") {
    return NextResponse.json({ message: "Verify email first" }, { status: 403 });
  }

  const match = await verifyPassword(password, user.password);
  if (!match) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 400 });
  }

  const token = signToken({
    id: user._id,
    role: user.role,
    isAdmin: user.role === "admin",
  });

  return NextResponse.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
}
