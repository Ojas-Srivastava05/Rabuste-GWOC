import { NextResponse } from "next/server";
import connectDB from "@/src/lib/mongodb";
import Coupon from "@/src/models/Coupon";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { code, orderAmount } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
    }

    const coupon = await Coupon.findOne({ 
      code: code.toUpperCase(),
      isActive: true,
    });

    if (!coupon) {
      return NextResponse.json({ error: "Invalid coupon code" }, { status: 404 });
    }

    // Check if coupon is expired
    const now = new Date();
    if (now < coupon.validFrom || now > coupon.validUntil) {
      return NextResponse.json({ error: "Coupon has expired" }, { status: 400 });
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return NextResponse.json({ error: "Coupon usage limit reached" }, { status: 400 });
    }

    // Check minimum order amount
    if (orderAmount < coupon.minOrderAmount) {
      return NextResponse.json({ 
        error: `Minimum order amount of ₹${coupon.minOrderAmount} required` 
      }, { status: 400 });
    }

    return NextResponse.json({
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
      description: coupon.description,
    });
  } catch (error) {
    console.error("Validate coupon error:", error);
    return NextResponse.json({ error: "Failed to validate coupon" }, { status: 500 });
  }
}