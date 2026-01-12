import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { cookies } from 'next/headers';
import connectDB from '@/src/lib/mongodb';
import Cart from '@/src/models/Cart';

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

    // ✅ SECURITY: Get frontend amount (for comparison only)
    const { amount: frontendAmount } = await request.json();
    console.log('💰 Frontend amount received:', frontendAmount);

    // ✅ SECURITY: Fetch cart from database and recalculate amount
    await connectDB();
    
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('sessionId')?.value;

    if (!sessionId) {
      console.error('❌ No session ID found');
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 401 }
      );
    }

    const cart = await Cart.findOne({ sessionId });

    if (!cart) {
      console.error('❌ Cart not found for session:', sessionId);
      return NextResponse.json(
        { error: 'Cart not found' },
        { status: 404 }
      );
    }

    // ✅ SECURITY: Calculate amount from database
    let calculatedAmount = cart.totalAmount || 0;
    
    // Apply coupon discount if exists
    if (cart.couponDiscount) {
      calculatedAmount -= cart.couponDiscount;
    }

    console.log('🔍 Amount verification:', {
      frontendAmount,
      calculatedAmount,
      match: Math.abs(frontendAmount - calculatedAmount) <= 1
    });

    // ✅ SECURITY: Verify frontend amount matches calculated amount
    // Allow 1 rupee difference for rounding errors
    if (!frontendAmount || Math.abs(frontendAmount - calculatedAmount) > 1) {
      console.error('❌ SECURITY ALERT: Amount mismatch detected!');
      console.error(`Frontend: ₹${frontendAmount}, Database: ₹${calculatedAmount}`);
      return NextResponse.json(
        { 
          error: 'Amount verification failed. Please refresh and try again.',
          details: 'Price mismatch between frontend and server'
        },
        { status: 400 }
      );
    }

    // Validate final amount
    if (calculatedAmount <= 0) {
      console.error('❌ Invalid amount:', calculatedAmount);
      return NextResponse.json(
        { error: 'Invalid cart total. Must be greater than 0' },
        { status: 400 }
      );
    }

    // ✅ Create Razorpay order with backend-calculated amount
    const options = {
      amount: Math.round(calculatedAmount * 100), // Convert to paise (smallest currency unit)
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1, // Auto capture payment
    };

    console.log('🔄 Creating order with secure amount:', options);
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