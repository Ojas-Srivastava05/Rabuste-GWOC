import { NextResponse } from "next/server";
import User from "@/src/models/Users";
import { connectDB } from "@/src/lib/db";
import { sendResetPasswordEmail } from "@/src/utils/sendResetPasswordEmail";

export async function POST(req: Request) {
  await connectDB();
  const { email } = await req.json();

  const user = await User.findOne({ email });
  if (!user) {
    // Security: don’t reveal if email exists
    return NextResponse.json({
      message: "If the email exists, a reset code has been sent",
    });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();

  user.resetPasswordCode = code;
  user.resetPasswordExpiry = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();

  await sendResetPasswordEmail(email, code);

  return NextResponse.json({
    message: "If the email exists, a reset code has been sent",
  });
}
