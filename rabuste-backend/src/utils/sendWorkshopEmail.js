import nodemailer from "nodemailer";

const sendWorkshopRegistrationEmail = async (userEmail, userName, workshopDetails) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const { title, date, time, location, instructor, category } = workshopDetails;
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  await transporter.sendMail({
    from: `"Rabuste Workshops" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: `Workshop Registration Confirmed - ${title}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              background-color: #000000;
              margin: 0;
              padding: 0;
            }
            .email-container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #1A1110;
              border: 3px solid #B87333;
            }
            .header {
              background: linear-gradient(135deg, #3D2B1F, #1A1110);
              padding: 40px 30px;
              text-align: center;
              border-bottom: 2px solid #B87333;
            }
            .header h1 {
              color: #FFFEF9;
              font-size: 32px;
              margin: 0 0 10px 0;
              font-weight: 700;
              letter-spacing: 2px;
            }
            .header .subtitle {
              color: #B87333;
              font-size: 14px;
              text-transform: uppercase;
              letter-spacing: 3px;
            }
            .content {
              padding: 40px 30px;
            }
            .success-badge {
              background: linear-gradient(135deg, #B87333, #CD7F32);
              color: #000;
              padding: 15px 30px;
              text-align: center;
              font-size: 18px;
              font-weight: bold;
              letter-spacing: 2px;
              margin-bottom: 30px;
            }
            .greeting {
              color: #FFFEF9;
              font-size: 18px;
              margin-bottom: 20px;
            }
            .message {
              color: rgba(255, 254, 249, 0.8);
              font-size: 16px;
              line-height: 1.6;
              margin-bottom: 30px;
            }
            .workshop-details {
              background: rgba(20, 20, 20, 0.6);
              border: 2px solid rgba(184, 115, 51, 0.3);
              padding: 25px;
              margin-bottom: 30px;
            }
            .workshop-details h2 {
              color: #D4A574;
              font-size: 24px;
              margin: 0 0 20px 0;
              font-weight: 600;
            }
            .detail-row {
              display: flex;
              margin-bottom: 15px;
              padding-bottom: 15px;
              border-bottom: 1px solid rgba(184, 115, 51, 0.2);
            }
            .detail-row:last-child {
              border-bottom: none;
              margin-bottom: 0;
              padding-bottom: 0;
            }
            .detail-label {
              color: #8B6F47;
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 1px;
              min-width: 120px;
              font-weight: 600;
            }
            .detail-value {
              color: #FFFEF9;
              font-size: 16px;
            }
            .category-badge {
              display: inline-block;
              background: rgba(184, 115, 51, 0.2);
              border: 2px solid rgba(184, 115, 51, 0.5);
              color: #D4A574;
              padding: 8px 16px;
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 2px;
              margin-top: 10px;
            }
            .footer {
              background: rgba(20, 20, 20, 0.8);
              padding: 30px;
              text-align: center;
              border-top: 2px solid rgba(184, 115, 51, 0.3);
            }
            .footer p {
              color: rgba(255, 254, 249, 0.6);
              font-size: 14px;
              line-height: 1.6;
              margin: 10px 0;
            }
            .footer .brand {
              color: #B87333;
              font-weight: bold;
              font-size: 18px;
              letter-spacing: 2px;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>RABUSTE</h1>
              <div class="subtitle">Workshop Registration</div>
            </div>
            
            <div class="content">
              <div class="success-badge">
                ✓ REGISTRATION CONFIRMED
              </div>
              
              <div class="greeting">
                Hello ${userName},
              </div>
              
              <div class="message">
                Thank you for registering for our workshop! We're excited to have you join us for an exceptional learning experience. Your spot has been reserved.
              </div>
              
              <div class="workshop-details">
                <h2>${title}</h2>
                
                <div class="detail-row">
                  <div class="detail-label">Date</div>
                  <div class="detail-value">${formattedDate}</div>
                </div>
                
                <div class="detail-row">
                  <div class="detail-label">Time</div>
                  <div class="detail-value">${time}</div>
                </div>
                
                <div class="detail-row">
                  <div class="detail-label">Location</div>
                  <div class="detail-value">${location}</div>
                </div>
                
                <div class="detail-row">
                  <div class="detail-label">Instructor</div>
                  <div class="detail-value">${instructor}</div>
                </div>
                
                <div class="category-badge">
                  ${category.toUpperCase()} WORKSHOP
                </div>
              </div>
              
              <div class="message">
                <strong>What to bring:</strong><br>
                Please arrive 10 minutes early. All materials will be provided. We recommend wearing comfortable clothing.
              </div>
              
              <div class="message">
                If you have any questions or need to make changes to your registration, please reply to this email or contact us directly.
              </div>
            </div>
            
            <div class="footer">
              <p class="brand">RABUSTE</p>
              <p>Master the art of bold coffee. Experience premium learning.</p>
              <p>This is an automated confirmation email. Please do not reply directly to this message.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  });
};

export default sendWorkshopRegistrationEmail;