import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import connectDB from "../../../../../../src/lib/mongodb";
import User from "../../../../../../src/models/Users";
import Coupon from "../../../../../../src/models/Coupon";
import { sendOrderEmail } from "@/src/lib/email";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectDB();

    const { id } = await params;
    const body = await req.json();
    const { discountType, discountPercentage, discountAmount, description, validUntil, minOrderAmount } = body;

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate unique coupon code
    const generateCouponCode = () => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let code = "";
      for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    };

    let code = generateCouponCode();
    while (await Coupon.findOne({ code })) {
      code = generateCouponCode();
    }

    // Create coupon
    const validUntilDate = validUntil ? new Date(validUntil) : new Date();
    validUntilDate.setDate(validUntilDate.getDate() + 30); // Default 30 days

    const coupon = await Coupon.create({
      code,
      discountType: discountType || "percentage",
      discountPercentage: discountType === "percentage" ? discountPercentage : null,
      discountAmount: discountType === "flat" ? discountAmount : null,
      description: description || `Special offer for ${user.name}`,
      isActive: true,
      validUntil: validUntilDate,
      usageLimit: 1,
      minOrderAmount: minOrderAmount || 0,
    });

    // Send email notification
    if (user.email) {
      const discountText = discountType === "flat"
        ? `₹${discountAmount} off`
        : `${discountPercentage}% off`;

      const emailHTML = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #B87333, #CD7F32); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border: 2px solid #B87333; border-top: none; }
              .coupon-box { background: white; border: 3px dashed #B87333; padding: 20px; text-align: center; margin: 20px 0; }
              .coupon-code { font-size: 32px; font-weight: bold; color: #B87333; letter-spacing: 5px; }
              .button { display: inline-block; padding: 12px 30px; background: #B87333; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0; font-size: 32px;">🎁 Special Offer for You!</h1>
              </div>
              <div class="content">
                <p>Hi ${user.name || "there"},</p>
                <p>We have a special coupon just for you!</p>
                
                <div class="coupon-box">
                  <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;">Your Coupon Code:</p>
                  <div class="coupon-code">${code}</div>
                  <p style="margin: 10px 0 0 0; font-size: 18px; color: #B87333; font-weight: bold;">${discountText}</p>
                  ${minOrderAmount > 0 ? `<p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">Valid on orders above ₹${minOrderAmount}</p>` : ''}
                </div>

                <p>${description || "Use this code at checkout to enjoy your discount."}</p>
                
                <a href="${process.env.NEXT_PUBLIC_FRONTEND_URL || "https://rabuste-coffee-gwoc.vercel.app"}/menu?coupon=${code}" class="button">Shop Now</a>
                
                <p style="margin-top: 30px; font-size: 12px; color: #666;">
                  Thank you for being a valued customer!<br>
                  <strong>Rabuste Coffee Team</strong>
                </p>
              </div>
            </div>
          </body>
        </html>
      `;

      try {
        await sendOrderEmail(
          user.email,
          "🎁 Special Coupon for You!",
          emailHTML
        );
      } catch (emailError) {
        console.error("Failed to send coupon email:", emailError);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({
      success: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountPercentage: coupon.discountPercentage,
        discountAmount: coupon.discountAmount,
      },
      emailSent: !!user.email,
    });
  } catch (error: any) {
    console.error("Generate coupon error:", error);
    return NextResponse.json(
      { error: "Failed to generate coupon" },
      { status: 500 }
    );
  }
}
