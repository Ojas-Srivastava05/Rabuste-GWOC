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
import { sendOrderEmail } from "@/src/lib/email";

export async function PATCH(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    await connectDB();

    const params = await context.params;
    const { id } = params;

    const { status } = await req.json();

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
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
        await sendOrderEmail(
          updatedOrder.customerEmail,
          "☕ Your order is ready!",
          `
            <h2>Order Completed 🎉</h2>
            <p>Hi ${updatedOrder.customerName},</p>
            <p>Your coffee is ready for pickup.</p>
            <p><strong>Total:</strong> ₹${updatedOrder.totalAmount}</p>
          `
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

