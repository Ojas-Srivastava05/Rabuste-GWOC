import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import connectDB from "@/src/lib/mongodb";
import Order from "@/src/models/Order";
import User from "@/src/models/Users";
import Coupon from "@/src/models/Coupon";
import { sendOrderConfirmation } from "@/src/lib/email";



export async function POST(req: Request) {
  await connectDB();

  try {
    // 🔥 FIX: read header from req
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET!
    );

    const userId = decoded.id;

    // Fetch user data from database
    const user = await User.findById(userId).select('name email');
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const data = await req.json();
    
    // Log incoming request data for debugging
    console.log('📦 Order creation request data:', {
      items: data.items?.length,
      totalAmount: data.totalAmount,
      couponCode: data.couponCode,
      couponDiscount: data.couponDiscount,
      instructions: data.instructions,
    });

    if (!data.items?.length || !data.totalAmount) {
      return NextResponse.json(
        { error: "Missing order data" },
        { status: 400 }
      );
    }

    // Fetch coupon and increment usage count if coupon is applied
    let couponDescription = null;
    if (data.couponCode) {
      const coupon = await Coupon.findOne({ code: data.couponCode.toUpperCase() });
      if (coupon) {
        couponDescription = coupon.description;
        
        // Increment the usage count
        coupon.usageCount = (coupon.usageCount || 0) + 1;
        await coupon.save();
        
        console.log(`✅ Coupon ${data.couponCode} usage incremented to ${coupon.usageCount}/${coupon.usageLimit || '∞'}`);
      } else {
        console.warn(`⚠️ Coupon ${data.couponCode} not found in database`);
      }
    }

    // Prepare order data - ALL fields must be explicitly set
    const orderData = {
      userId,
      customerName: user.name,
      customerEmail: user.email,
      items: data.items,
      totalAmount: Number(data.totalAmount),
      instructions: data.instructions ? String(data.instructions) : "",
      couponCode: data.couponCode ? String(data.couponCode).toUpperCase() : null,
      couponDiscount: data.couponDiscount ? Number(data.couponDiscount) : 0,
      couponDescription: couponDescription || null,
      status: "pending",
    };
    
    console.log('💾 API - Creating order:', {
      customerName: orderData.customerName,
      totalAmount: orderData.totalAmount,
      couponCode: orderData.couponCode,
      couponDiscount: orderData.couponDiscount,
      itemsCount: orderData.items.length,
    });
    
    // Create order
    const order = await Order.create(orderData);
    
    // Fetch back to verify all fields were saved
    const savedOrder = await Order.findById(order._id).lean();
    
    console.log('✅ API - Order saved:', {
      _id: savedOrder?._id,
      totalAmount: savedOrder?.totalAmount,
      couponCode: savedOrder?.couponCode,
      couponDiscount: savedOrder?.couponDiscount,
      hasCouponCode: 'couponCode' in (savedOrder || {}),
      hasCouponDiscount: 'couponDiscount' in (savedOrder || {}),
    });

    // Send premium order confirmation email (non-blocking)
    sendOrderConfirmation(user.email, {
      customerName: user.name,
      items: savedOrder?.items || [],
      totalAmount: savedOrder?.totalAmount || 0,
      instructions: savedOrder?.instructions || "",
      orderId: savedOrder?._id?.toString() || "",
    }).catch(err => console.error("Email failed:", err));

    return NextResponse.json(savedOrder, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}



export async function GET(req: Request) {
  await connectDB();

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET!
    );
    const isAdmin = decoded.role === "admin" || decoded.isAdmin === true;
    const query = isAdmin ? {} : { userId: decoded.id };

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    
    // Log orders with coupon data for debugging
    const ordersWithCoupons = orders.filter((o: any) => o.couponCode && o.couponDiscount > 0);
    console.log(`📊 Fetching ${orders.length} orders (${ordersWithCoupons.length} with coupons)`);
    
    if (ordersWithCoupons.length > 0) {
      console.log('✅ Sample order with coupon:', {
        id: ordersWithCoupons[0]._id,
        couponCode: ordersWithCoupons[0].couponCode,
        couponDiscount: ordersWithCoupons[0].couponDiscount,
        totalAmount: ordersWithCoupons[0].totalAmount,
      });
    }
    
    return NextResponse.json(orders);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


export async function PATCH(req: Request) {
  await connectDB();

  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();
    const data = await req.json();

    if (!id || !data.status) {
      return NextResponse.json({ error: "Missing ID or status" }, { status: 400 });
    }

    const updated = await Order.findByIdAndUpdate(
      id,
      { status: data.status },
      { new: true }
    );

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
