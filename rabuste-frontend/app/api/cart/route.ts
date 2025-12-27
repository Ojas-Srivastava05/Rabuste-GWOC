import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/src/lib/mongodb";
import Cart from "@/src/models/Cart";
import Menu from "@/src/models/Menu";

export async function GET() {
  await connectDB();

  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId")?.value;

  if (!sessionId) {
    return NextResponse.json({ items: [], totalAmount: 0 });
  }

  const cart = await Cart.findOne({ sessionId });

  if (!cart) {
    return NextResponse.json({ items: [], totalAmount: 0 });
  }

  return NextResponse.json(cart);
}

export async function POST(req: Request) {
  await connectDB();

  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId")?.value;

  if (!sessionId) {
    return NextResponse.json({ error: "No session" }, { status: 400 });
  }

  const { menuItemId, quantity } = await req.json();

  const menuItem = await Menu.findById(menuItemId);
  if (!menuItem || !menuItem.isAvailable) {
    return NextResponse.json({ error: "Invalid item" }, { status: 400 });
  }

  let cart = await Cart.findOne({ sessionId });

  if (!cart) {
    cart = await Cart.create({
      sessionId,
      items: [],
      totalAmount: 0,
    });
  }

  const existingItem = cart.items.find(
    (item: any) => item.menuItem.toString() === menuItemId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  
    // remove item if quantity <= 0
    if (existingItem.quantity <= 0) {
      cart.items = cart.items.filter(
        (item: any) => item.menuItem.toString() !== menuItemId
      );
    }
  } else if (quantity > 0) {
    cart.items.push({
      menuItem: menuItem._id,
      name: menuItem.name,
      price: menuItem.price,
      quantity,
    });
  }
  

  cart.totalAmount = cart.items.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0
  );

  await cart.save();

  return NextResponse.json(cart);
}

export async function DELETE() {
    await connectDB();
  
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("sessionId")?.value;
  
    if (sessionId) {
      await Cart.deleteOne({ sessionId });
    }
  
    return NextResponse.json({ success: true });
  }
  