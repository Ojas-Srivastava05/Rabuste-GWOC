// import { NextResponse } from "next/server";
// import connectDB from "@/src/lib/mongodb";
// import Order from "@/src/models/Order";

// export async function PATCH(
//   req: Request,
//   context: { params: { id: string } }
// ) {
//   try {
//     await connectDB();

//     // Unwrap params
//     const params = await context.params;
//     const { id } = params;

//     const { status } = await req.json();

//     const updatedOrder = await Order.findByIdAndUpdate(
//       id,
//       { status },
//       { new: true }
//     );

//     if (!updatedOrder) {
//       return NextResponse.json({ error: "Order not found" }, { status: 404 });
//     }

//     return NextResponse.json(updatedOrder);
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
//   }
// }
import { NextResponse } from "next/server";
import connectDB from "@/src/lib/mongodb";
import Order from "@/src/models/Order";
import { sendOrderReady } from "@/src/lib/email";
import jwt from "jsonwebtoken";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    const params = await context.params;
    const { id } = params;

    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Check if user owns this order or is admin
    const isAdmin = decoded.role === "admin" || decoded.isAdmin === true;
    if (!isAdmin && order.userId.toString() !== decoded.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(order);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const isAdmin = decoded.role === "admin" || decoded.isAdmin === true;

    const params = await context.params;
    const { id } = params;

    const updateData = await req.json();
    const { status, preparationTime } = updateData;

    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Build update object
    const updateFields: any = {};
    if (status !== undefined) updateFields.status = status;
    if (preparationTime !== undefined) {
      // Validate preparation time (should be positive number)
      const prepTime = Number(preparationTime);
      if (isNaN(prepTime) || prepTime < 0) {
        return NextResponse.json(
          { error: "Preparation time must be a positive number" },
          { status: 400 }
        );
      }
      updateFields.preparationTime = prepTime;
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      updateFields,
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // ✅ EMAIL SHOULD NOT BREAK STATUS UPDATE
    if (status === "completed") {
      try {
        await sendOrderReady(
          updatedOrder.customerEmail,
          {
            customerName: updatedOrder.customerName,
            items: updatedOrder.items,
            totalAmount: updatedOrder.totalAmount,
            orderId: updatedOrder._id.toString(),
          }
        );
      } catch (emailError) {
        console.error("Email failed:", emailError);
      }
    }

    return NextResponse.json(updatedOrder);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}

