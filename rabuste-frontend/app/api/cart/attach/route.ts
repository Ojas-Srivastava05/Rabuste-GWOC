import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import connectDB from "@/src/lib/mongodb";
import Cart from "@/src/models/Cart";

export async function POST(req: Request) {
  try {
    await connectDB();

    // 1. Get sessionId
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("sessionId")?.value;

    if (!sessionId) {
      return NextResponse.json(
        { error: "No session found" },
        { status: 400 }
      );
    }

    // 2. Get JWT from Authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "No auth token" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    // 3. Verify token
    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET!
    );

    const userId = decoded.id;

    // 4. Find cart by session
    const cart = await Cart.findOne({ sessionId });

    if (!cart) {
      return NextResponse.json(
        { message: "No cart to attach" },
        { status: 200 }
      );
    }

    // 5. Attach cart to user
    cart.userId = userId;
    await cart.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Attach cart error:", error);
    return NextResponse.json(
      { error: "Failed to attach cart" },
      { status: 500 }
    );
  }
}
