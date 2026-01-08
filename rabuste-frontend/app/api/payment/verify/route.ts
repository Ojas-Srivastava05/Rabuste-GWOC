import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const paymentData = await request.json();
    
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentData;
    
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing payment verification data" },
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

    // Forward the request to backend for verification
    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/payment/verify`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(paymentData),
      }
    );

    if (!backendResponse.ok) {
      throw new Error("Payment verification failed");
    }

    const verificationResult = await backendResponse.json();
    return NextResponse.json(verificationResult);
    
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 }
    );
  }
}