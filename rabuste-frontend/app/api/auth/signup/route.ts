import { NextResponse } from "next/server";
import crypto from "crypto";
import User from "@/src/models/Users";
import { connectDB } from "@/src/lib/db";
import { hashPassword } from "@/src/lib/password";
import { sendVerificationEmail } from "@/src/utils/sendVerificationEmail";

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();

  const { name, email, password, phoneCountryCode, phoneNumber } = body;

  if (!name || !email || !password || !phoneNumber) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  const exists = await User.findOne({ email });
  if (exists) {
    return NextResponse.json({ message: "Email already exists" }, { status: 400 });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();

  await User.create({
    name,
    email,
    password: await hashPassword(password),
    phone: {
      countryCode: phoneCountryCode,
      number: phoneNumber,
      fullNumber: `${phoneCountryCode}${phoneNumber}`,
    },
    isVerified: false,
    verificationCode: code,
    verificationCodeExpiry: Date.now() + 10 * 60 * 1000,
  });

  await sendVerificationEmail(email, code);

  return NextResponse.json({
    message: "Verification code sent to email",
  });
}
