import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

// POST /api/franchise/enquiry
router.post("/enquiry", async (req, res) => {
  console.log("🔔 Franchise enquiry received");
  console.log("📝 Form data:", req.body);

  try {
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
    } = req.body;

    // Validate required fields
    if (!fullName || !email || !phone || !city || !state || !preferredLocation || !investmentCapacity) {
      console.log("❌ Validation failed - missing required fields");
      return res.status(400).json({ 
        success: false, 
        message: "Please fill in all required fields" 
      });
    }

    console.log("✅ Validation passed");

    // Create transporter INSIDE the route (fresh for each request)
    console.log("📧 Creating email transporter...");
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER?.trim(),
        pass: process.env.EMAIL_PASS?.trim(),
      },
    });

    // Test connection
    console.log("🔍 Verifying email connection...");
    await transporter.verify();
    console.log("✅ Email connection verified!");

    // Email content for admin
    const adminEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #D97706; border-bottom: 2px solid #D97706; padding-bottom: 10px;">
          New Franchise Enquiry - Rabuste Coffee
        </h2>
        
        <!-- Prominent Contact Section -->
        <div style="background-color: #D97706; color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: white; margin-top: 0;">📧 Contact Applicant</h3>
          <p style="font-size: 16px; margin: 10px 0;">
            <strong>Email:</strong> <a href="mailto:${email}" style="color: white; text-decoration: underline;">${email}</a>
          </p>
          <p style="font-size: 16px; margin: 10px 0;">
            <strong>Phone:</strong> <a href="tel:${phone}" style="color: white; text-decoration: none;">${phone}</a>
          </p>
          <p style="font-size: 12px; margin-top: 15px; opacity: 0.9;">
            Click the email above to reply directly to the applicant
          </p>
        </div>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Personal Information</h3>
          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Applying As:</strong> ${organizationType}</p>
          ${organizationName ? `<p><strong>Organization:</strong> ${organizationName}</p>` : ''}
        </div>

        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Location Details</h3>
          <p><strong>City:</strong> ${city}</p>
          <p><strong>State:</strong> ${state}</p>
          <p><strong>Preferred Location:</strong> ${preferredLocation}</p>
        </div>

        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Business Details</h3>
          <p><strong>Investment Capacity:</strong> ₹${investmentCapacity} Lakhs</p>
          ${experience ? `<p><strong>Previous Experience:</strong> ${experience}</p>` : ''}
        </div>

        ${message ? `
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Additional Message</h3>
            <p>${message}</p>
          </div>
        ` : ''}

        <!-- Quick Reply Button -->
        <div style="text-align: center; margin: 30px 0;">
          <a href="mailto:${email}?subject=Re: Franchise Enquiry - Rabuste Coffee&body=Dear ${fullName},%0D%0A%0D%0AThank you for your interest in Rabuste Coffee franchise.%0D%0A%0D%0A" 
             style="background-color: #D97706; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
            📧 Reply to ${fullName}
          </a>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
          <p>This enquiry was submitted through the Rabuste Coffee franchise page.</p>
          <p>Timestamp: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
        </div>
      </div>
    `;

    // Email content for applicant
    const applicantEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #D97706; border-bottom: 2px solid #D97706; padding-bottom: 10px;">
          Thank You for Your Interest in Rabuste Coffee Franchise
        </h2>
        
        <p>Dear ${fullName},</p>
        
        <p>Thank you for your interest in opening a Rabuste Coffee franchise. We have received your enquiry and our franchise team will review your application.</p>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">What Happens Next?</h3>
          <ul style="line-height: 1.8;">
            <li>Our team will review your application within 2-3 business days</li>
            <li>If your profile matches our requirements, we'll schedule a call to discuss further</li>
            <li>We'll provide detailed information about the franchise opportunity</li>
            <li>You'll have the chance to ask questions and understand the process better</li>
          </ul>
        </div>

        <div style="background-color: #fff3e0; padding: 15px; border-left: 4px solid #D97706; margin: 20px 0;">
          <p style="margin: 0;"><strong>Your Enquiry Details:</strong></p>
          <p style="margin: 10px 0 0 0;">Location: ${city}, ${state}</p>
          <p style="margin: 5px 0 0 0;">Investment Capacity: ₹${investmentCapacity} Lakhs</p>
        </div>

        <p>If you have any immediate questions, feel free to reply to this email or contact us at:</p>
        <p>
          <strong>Email:</strong> ${process.env.ADMIN_EMAIL?.trim() || process.env.EMAIL_USER?.trim()}<br>
          <strong>Phone:</strong> +91 XXXXX XXXXX
        </p>

        <p style="margin-top: 30px;">Best regards,<br>
        <strong>Rabuste Coffee Franchise Team</strong></p>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center;">
          <p>© ${new Date().getFullYear()} Rabuste Coffee. All rights reserved.</p>
        </div>
      </div>
    `;

    console.log("📧 Attempting to send email to admin...");
    console.log("   From:", process.env.EMAIL_USER?.trim());
    console.log("   To:", process.env.ADMIN_EMAIL?.trim() || process.env.EMAIL_USER?.trim());
    console.log("   Reply-To:", email);

    // Send email to admin
    const adminEmailResult = await transporter.sendMail({
      from: process.env.EMAIL_USER?.trim(),
      replyTo: email,
      to: process.env.ADMIN_EMAIL?.trim() || process.env.EMAIL_USER?.trim(),
      subject: `New Franchise Enquiry - ${city}, ${state} - ${fullName}`,
      html: adminEmailContent,
    });

    console.log("✅ Admin email sent successfully!");
    console.log("   Message ID:", adminEmailResult.messageId);

    console.log("📧 Attempting to send confirmation email to applicant...");
    console.log("   To:", email);

    // Send confirmation email to applicant
    const applicantEmailResult = await transporter.sendMail({
      from: process.env.EMAIL_USER?.trim(),
      to: email,
      subject: "Thank You for Your Franchise Enquiry - Rabuste Coffee",
      html: applicantEmailContent,
    });

    console.log("✅ Applicant confirmation email sent successfully!");
    console.log("   Message ID:", applicantEmailResult.messageId);

    res.status(200).json({
      success: true,
      message: "Franchise enquiry submitted successfully. Check your email for confirmation.",
    });

  } catch (error) {
    console.error("❌ Franchise enquiry error:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      command: error.command,
    });
    
    res.status(500).json({
      success: false,
      message: "Failed to submit franchise enquiry. Please try again later.",
      error: error.message,
    });
  }
});

export default router;