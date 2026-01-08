import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    console.log('📝 Creating Razorpay order...');
    
    // Check if Razorpay credentials exist
    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
      console.error('❌ NEXT_PUBLIC_RAZORPAY_KEY_ID is missing');
      return NextResponse.json(
        { error: 'Razorpay Key ID not configured' },
        { status: 500 }
      );
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.error('❌ RAZORPAY_KEY_SECRET is missing');
      return NextResponse.json(
        { error: 'Razorpay Key Secret not configured' },
        { status: 500 }
      );
    }

    const { amount } = await request.json();
    console.log('💰 Amount received:', amount);

    // Validate amount
    if (!amount || amount <= 0) {
      console.error('❌ Invalid amount:', amount);
      return NextResponse.json(
        { error: 'Invalid amount. Must be greater than 0' },
        { status: 400 }
      );
    }

    // Create Razorpay order
    const options = {
      amount: Math.round(amount * 100), // Convert to paise (smallest currency unit)
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1, // Auto capture payment
    };

    console.log('🔄 Creating order with options:', options);
    const order = await razorpay.orders.create(options);
    console.log('✅ Order created successfully:', order.id);

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
    });

  } catch (error: any) {
    console.error('❌ Razorpay order creation error:', error);
    console.error('Error details:', {
      message: error.message,
      description: error.error?.description,
      code: error.statusCode,
    });

    return NextResponse.json(
      { 
        error: 'Failed to create Razorpay order',
        details: error.error?.description || error.message,
        code: error.statusCode || 500,
      },
      { status: 500 }
    );
  }
}