import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { amount } = await request.json();
    
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Valid amount is required" },
        { status: 400 }
      );
    }

    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return NextResponse.json(
        { error: "Authorization token required" },
        { status: 401 }
      );
    }

    // Forward the request to backend
    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/payment/create-order`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ amount }),
      }
    );

    if (!backendResponse.ok) {
      throw new Error("Failed to create Razorpay order");
    }

    const orderData = await backendResponse.json();
    return NextResponse.json(orderData);
    
  } catch (error) {
    console.error("Payment order creation error:", error);
    return NextResponse.json(
      { error: "Failed to create payment order" },
      { status: 500 }
    );
  }
}