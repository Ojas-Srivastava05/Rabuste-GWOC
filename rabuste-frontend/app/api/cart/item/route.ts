import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/src/lib/mongodb";
import Cart from "@/src/models/Cart";

export async function DELETE(req: Request) {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const sessionId = cookieStore.get("sessionId")?.value;

    if (!sessionId) {
      return NextResponse.json({ error: "No session" }, { status: 400 });
    }

    const { itemId, itemType } = await req.json();

    if (!itemId || !itemType) {
      return NextResponse.json({ error: "Missing itemId or itemType" }, { status: 400 });
    }

    const cart = await Cart.findOne({ sessionId });

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    // Remove the item from cart
    if (itemType === "menu") {
      cart.items = cart.items.filter(
        (item: any) => !(item.itemType === "menu" && item.menuItem?.toString() === itemId)
      );
    } else if (itemType === "art") {
      cart.items = cart.items.filter(
        (item: any) => !(item.itemType === "art" && item.artItem?.toString() === itemId)
      );
    }

    // Recalculate total
    cart.totalAmount = cart.items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );

    // Recalculate coupon discount if exists
    if (cart.couponCode && cart.couponDiscount) {
      const menuItemsTotal = cart.items
        .filter((item: any) => item.itemType === "menu")
        .reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
      
      const discountPercentage = (cart.couponDiscount / (menuItemsTotal + cart.couponDiscount)) * 100;
      cart.couponDiscount = Math.round((menuItemsTotal * discountPercentage) / 100);
      cart.discountedTotal = cart.totalAmount - cart.couponDiscount;
    }

    await cart.save();

    return NextResponse.json(cart);
  } catch (error) {
    console.error("Cart item DELETE error:", error);
    return NextResponse.json({ error: "Failed to remove item" }, { status: 500 });
  }
}