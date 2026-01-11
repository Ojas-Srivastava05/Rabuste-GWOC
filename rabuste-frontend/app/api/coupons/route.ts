import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/db";
import Coupon from "@/src/models/Coupon";

// Public route to get all active coupons
export async function GET() {
  try {
    await connectDB();

    const now = new Date();
    
    // Get all active coupons that are valid
    const coupons = await Coupon.find({
      isActive: true,
      validFrom: { $lte: now },
      validUntil: { $gte: now },
    }).sort({ createdAt: -1 });

    // Filter coupons that haven't exceeded usage limit
    const availableCoupons = coupons.filter(coupon => {
      if (coupon.usageLimit === null) return true; // Unlimited
      return (coupon.usageCount || 0) < coupon.usageLimit;
    });

    return NextResponse.json({ coupons: availableCoupons });
  } catch (error) {
    console.error("Get coupons error:", error);
    return NextResponse.json(
      { error: "Failed to fetch coupons" },
      { status: 500 }
    );
  }
}
