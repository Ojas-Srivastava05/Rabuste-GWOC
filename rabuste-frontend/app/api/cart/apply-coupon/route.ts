import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/src/lib/mongodb";
import Cart from "@/src/models/Cart";

export async function POST(req: Request) {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const sessionId = cookieStore.get("sessionId")?.value;

    if (!sessionId) {
      return NextResponse.json({ error: "No session" }, { status: 400 });
    }

    const { couponCode, discountPercentage } = await req.json();

    const cart = await Cart.findOne({ sessionId });

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    // Calculate total for menu items only (coupons don't apply to art)
    const menuItemsTotal = cart.items
      .filter((item: any) => item.itemType === "menu")
      .reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

    // Calculate discount
    const discount = Math.round((menuItemsTotal * discountPercentage) / 100);
    
    // Update cart with coupon
    cart.couponCode = couponCode;
    cart.couponDiscount = discount;
    cart.discountedTotal = cart.totalAmount - discount;

    await cart.save();

    return NextResponse.json(cart);
  } catch (error) {
    console.error("Apply coupon error:", error);
    return NextResponse.json({ error: "Failed to apply coupon" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const sessionId = cookieStore.get("sessionId")?.value;

    if (!sessionId) {
      return NextResponse.json({ error: "No session" }, { status: 400 });
    }

    const cart = await Cart.findOne({ sessionId });

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    // Remove coupon
    cart.couponCode = null;
    cart.couponDiscount = 0;
    cart.discountedTotal = 0;

    await cart.save();

    return NextResponse.json(cart);
  } catch (error) {
    console.error("Remove coupon error:", error);
    return NextResponse.json({ error: "Failed to remove coupon" }, { status: 500 });
  }
}