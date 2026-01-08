import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Verifying Razorpay payment...');

    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.error('❌ RAZORPAY_KEY_SECRET is missing');
      return NextResponse.json(
        { 
          success: false,
          error: 'Razorpay Key Secret not configured' 
        },
        { status: 500 }
      );
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();

    console.log('📋 Payment details received:', {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      hasSignature: !!razorpay_signature,
    });

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      console.error('❌ Missing payment details');
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing payment details' 
        },
        { status: 400 }
      );
    }

    // Create signature verification string
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    
    // Generate expected signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    // Compare signatures
    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      console.log('✅ Payment verified successfully:', razorpay_payment_id);
      
      return NextResponse.json({
        success: true,
        message: 'Payment verified successfully',
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
      });
    } else {
      console.error('❌ Payment verification failed - Invalid signature');
      console.error('Expected:', expectedSignature);
      console.error('Received:', razorpay_signature);
      
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid payment signature' 
        },
        { status: 400 }
      );
    }

  } catch (error: any) {
    console.error('❌ Payment verification error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Payment verification failed',
        details: error.message 
      },
      { status: 500 }
    );
  }
}