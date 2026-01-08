type FranchisePayload = {
  fullName: string;
  email: string;
  phone: string;
  organizationName?: string;
  organizationType: string;
  city: string;
  state: string;
  preferredLocation: string;
  investmentCapacity: string;
  experience?: string;
  message?: string;
};

export function getAdminEmailHTML(data: FranchisePayload) {
  return  `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #D97706; border-bottom: 2px solid #D97706; padding-bottom: 10px;">
          New Franchise Enquiry - Rabuste Coffee
        </h2>
        
        <!-- Prominent Contact Section -->
        <div style="background-color: #D97706; color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: white; margin-top: 0;">📧 Contact Applicant</h3>
          <p style="font-size: 16px; margin: 10px 0;">
            <strong>Email:</strong> <a href="mailto:${data.email}" style="color: white; text-decoration: underline;">${data.email}</a>
          </p>
          <p style="font-size: 16px; margin: 10px 0;">
            <strong>Phone:</strong> <a href="tel:${data.phone}" style="color: white; text-decoration: none;">${data.phone}</a>
          </p>
          <p style="font-size: 12px; margin-top: 15px; opacity: 0.9;">
            Click the email above to reply directly to the applicant
          </p>
        </div>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Personal Information</h3>
          <p><strong>Name:</strong> ${data.fullName}</p>
          <p><strong>Applying As:</strong> ${data.organizationType}</p>
          ${data.organizationName ? `<p><strong>Organization:</strong> ${data.organizationName}</p>` : ''}
        </div>

        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Location Details</h3>
          <p><strong>City:</strong> ${data.city}</p>
          <p><strong>State:</strong> ${data.state}</p>
          <p><strong>Preferred Location:</strong> ${data.preferredLocation}</p>
        </div>

        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Business Details</h3>
          <p><strong>Investment Capacity:</strong> ₹${data.investmentCapacity} Lakhs</p>
          ${data.experience ? `<p><strong>Previous Experience:</strong> ${data.experience}</p>` : ''}
        </div>

        ${data.message ? `
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Additional Message</h3>
            <p>${data.message}</p>
          </div>
        ` : ''}

        <!-- Quick Reply Button -->
        <div style="text-align: center; margin: 30px 0;">
          <a href="mailto:${data.email}?subject=Re: Franchise Enquiry - Rabuste Coffee&body=Dear ${data.fullName},%0D%0A%0D%0AThank you for your interest in Rabuste Coffee franchise.%0D%0A%0D%0A" 
             style="background-color: #D97706; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
            📧 Reply to ${data.fullName}
          </a>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
          <p>This enquiry was submitted through the Rabuste Coffee franchise page.</p>
          <p>Timestamp: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
        </div>
      </div>
    `;
}

export function getApplicantEmailHTML(data: FranchisePayload) {
  return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #D97706; border-bottom: 2px solid #D97706; padding-bottom: 10px;">
          Thank You for Your Interest in Rabuste Coffee Franchise
        </h2>
        
        <p>Dear ${data.fullName},</p>
        
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
          <p style="margin: 10px 0 0 0;">Location: ${data.city}, ${data.state}</p>
          <p style="margin: 5px 0 0 0;">Investment Capacity: ₹${data.investmentCapacity} Lakhs</p>
        </div>

        <p>If you have any immediate questions, feel free to reply to this email or contact us at:</p>
        <p>
          <strong>Email:</strong> ${process.env.ADMIN_EMAIL?.trim() || process.env.EMAIL_USER?.trim()}<br>
          <strong>Phone:</strong> +91 XXXXX XXXXX
        </p>

        <p style="margin-top: 30px;">Best regards,<br>
        <strong>Rabuste Coffee Franchise Team</strong></p>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center;">
          <p>©️ ${new Date().getFullYear()} Rabuste Coffee. All rights reserved.</p>
        </div>
      </div>
    `;
}
