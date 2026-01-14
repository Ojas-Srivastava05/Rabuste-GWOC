import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import connectDB from "@/src/lib/mongodb";
import GameCompletion from "@/src/models/GameCompletion";
import Coupon from "@/src/models/Coupon";
import User from "@/src/models/Users";
import { sendOrderEmail } from "@/src/lib/email";

const GAMES_REQUIRED_FOR_COUPON = 3; // Complete 3 games to get a coupon

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    await connectDB();

    const { gameType } = await req.json();

    if (!gameType || !["memory", "trivia", "origin"].includes(gameType)) {
      return NextResponse.json({ error: "Invalid game type" }, { status: 400 });
    }

    // Record game completion
    await GameCompletion.create({
      userId: decoded.userId,
      gameType,
    });

    // Count total game completions for this user
    const totalCompletions = await GameCompletion.countDocuments({
      userId: decoded.userId,
    });

    // Check if user has completed enough games to earn a coupon
    let couponGenerated = false;
    let couponCode = null;

    if (totalCompletions === GAMES_REQUIRED_FOR_COUPON) {
      // Generate a unique coupon code
      const generateCouponCode = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let code = "";
        for (let i = 0; i < 8; i++) {
          code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
      };

      let code = generateCouponCode();
      // Ensure code is unique
      while (await Coupon.findOne({ code })) {
        code = generateCouponCode();
      }

      // Create coupon (flat ₹50 off, valid for 30 days)
      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + 30);

      const coupon = await Coupon.create({
        code,
        discountType: "flat",
        discountAmount: 50,
        discountPercentage: null,
        description: "Congratulations! You completed 3 games. Enjoy ₹50 off on your next order!",
        isActive: true,
        validUntil,
        usageLimit: 1, // One-time use
        minOrderAmount: 100,
      });

      couponCode = code;
      couponGenerated = true;

      // Get user details for email
      const user = await User.findById(decoded.userId);
      if (user && user.email) {
        // Send email notification
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
                  <h1 style="margin: 0; font-size: 32px;">🎉 Congratulations!</h1>
                  <p style="margin: 10px 0 0 0; font-size: 18px;">You've earned a reward!</p>
                </div>
                <div class="content">
                  <p>Hi ${user.name || "there"},</p>
                  <p>Amazing work! You've completed ${GAMES_REQUIRED_FOR_COUPON} games on our order status page. As a reward, we've generated a special coupon just for you!</p>
                  
                  <div class="coupon-box">
                    <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;">Your Coupon Code:</p>
                    <div class="coupon-code">${code}</div>
                    <p style="margin: 10px 0 0 0; font-size: 18px; color: #B87333; font-weight: bold;">₹50 OFF</p>
                    <p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">Valid on orders above ₹100</p>
                  </div>

                  <p>Use this code at checkout to enjoy your discount. This coupon is valid for 30 days and can be used once.</p>
                  
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
            "🎉 You've Earned a Reward!",
            emailHTML
          );
        } catch (emailError) {
          console.error("Failed to send coupon email:", emailError);
          // Don't fail the request if email fails
        }
      }
    }

    return NextResponse.json({
      success: true,
      totalCompletions,
      couponGenerated,
      couponCode,
      gamesRemaining: Math.max(0, GAMES_REQUIRED_FOR_COUPON - totalCompletions),
    });
  } catch (error: any) {
    console.error("Game completion error:", error);
    return NextResponse.json(
      { error: "Failed to record game completion" },
      { status: 500 }
    );
  }
}
