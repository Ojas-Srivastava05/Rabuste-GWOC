import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import connectDB from "@/src/lib/mongodb";
import Coupon from "@/src/models/Coupon";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectDB();

    const coupons = await Coupon.find().sort({ createdAt: -1 });

    return NextResponse.json(coupons);
  } catch (error) {
    console.error("Get coupons error:", error);
    return NextResponse.json({ error: "Failed to fetch coupons" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectDB();

    const body = await req.json();
    const { code, discountType, discountPercentage, discountAmount, description, validUntil, usageLimit, minOrderAmount } = body;

    if (!code || !validUntil) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Validate discount fields based on type
    if (discountType === "percentage") {
      if (discountPercentage === undefined || discountPercentage <= 0 || discountPercentage > 100) {
        return NextResponse.json({ error: "Invalid discount percentage" }, { status: 400 });
      }
    } else if (discountType === "flat") {
      if (discountAmount === undefined || discountAmount <= 0) {
        return NextResponse.json({ error: "Invalid discount amount" }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: "Invalid discount type" }, { status: 400 });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discountType: discountType || "percentage",
      discountPercentage: discountType === "percentage" ? discountPercentage : null,
      discountAmount: discountType === "flat" ? discountAmount : null,
      description,
      validUntil: new Date(validUntil),
      usageLimit,
      minOrderAmount: minOrderAmount || 0,
    });

    return NextResponse.json(coupon);
  } catch (error: any) {
    console.error("Create coupon error:", error);
    if (error.code === 11000) {
      return NextResponse.json({ error: "Coupon code already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create coupon" }, { status: 500 });
  }
}