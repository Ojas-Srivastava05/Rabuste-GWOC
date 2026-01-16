import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Send to backend for AI analysis and storage
    const backendURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
    
    try {
      const backendResponse = await axios.post(`${backendURL}/api/feedback`, body);
      // Backend handles AI analysis and storage
    } catch (backendError: any) {
      console.error("Backend feedback error:", backendError);
      // Continue with email notification even if backend fails
    }

    const {
      type,
      userId,
      userEmail,
      userName,
      orderId,
      rating,
      comments,
    } = body;

    if (!type || !rating) {
      return NextResponse.json(
        { success: false, message: "Feedback type and rating are required" },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Create feedback summary
    let feedbackSummary = `
      <h2 style="color: #D4A574; font-family: 'Bebas Neue', Arial, sans-serif; font-size: 24px; margin-bottom: 20px;">
        ${type.toUpperCase()} FEEDBACK
      </h2>
      <p><strong>User:</strong> ${userName} (${userEmail || 'Guest'})</p>
      ${userId ? `<p><strong>User ID:</strong> ${userId}</p>` : ''}
      ${orderId ? `<p><strong>Order ID:</strong> ${orderId}</p>` : ''}
      <p><strong>Overall Rating:</strong> ${rating}/5 ⭐</p>
    `;

    if (comments) {
      feedbackSummary += `<p><strong>Comments:</strong><br>${comments}</p>`;
    }

    const emailHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #B87333, #CD7F32); color: white; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; border: 2px solid #B87333; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-family: 'Bebas Neue', Arial, sans-serif; font-size: 32px;">
                NEW FEEDBACK RECEIVED
              </h1>
            </div>
            <div class="content">
              ${feedbackSummary}
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email to admin
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      replyTo: userEmail || process.env.EMAIL_USER,
      subject: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Feedback - Rating: ${rating}/5`,
      html: emailHTML,
    });

    return NextResponse.json({
      success: true,
      message: "Feedback submitted successfully. Thank you!",
    });

  } catch (error: any) {
    console.error("Feedback API Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
