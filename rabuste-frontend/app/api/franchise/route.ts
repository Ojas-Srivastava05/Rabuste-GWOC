import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getAdminEmailHTML, getApplicantEmailHTML } from "@/src/utils/franchiseEmail";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      fullName,
      email,
      phone,
      organizationName,
      organizationType,
      city,
      state,
      preferredLocation,
      investmentCapacity,
      experience,
      message,
    } = body;

    if (!fullName || !email || !phone || !city || !state || !preferredLocation || !investmentCapacity) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
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

    // Admin email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      replyTo: email,
      subject: `New Franchise Enquiry - ${city}, ${state}`,
      html: getAdminEmailHTML(body),
    });

    // Applicant email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Thank You for Your Franchise Enquiry - Rabuste Coffee",
      html: getApplicantEmailHTML(body),
    });

    return NextResponse.json({
      success: true,
      message: "Franchise enquiry submitted successfully. Check your email.",
    });

  } catch (error: any) {
    console.error("Franchise API Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
