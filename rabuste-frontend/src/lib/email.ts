import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Brand colors for email templates
const BRAND_COLORS = {
  midnight: '#1A1110',
  espresso: '#2B1810',
  copper: '#B87333',
  bronze: '#CD7F32',
  golden: '#D4A574',
  cream: '#F5F1E8',
  warmWhite: '#FFFEF9',
};

// Email base template with premium styling
const getEmailTemplate = (content: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rabuste - Unapologetically Bold</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, sans-serif !important;}
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #0A0A0A; font-family: 'Work Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #0A0A0A;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background: linear-gradient(180deg, ${BRAND_COLORS.midnight} 0%, ${BRAND_COLORS.espresso} 100%); border: 2px solid ${BRAND_COLORS.copper}; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(184, 115, 51, 0.2);">
          
          <!-- Premium Copper Top Border -->
          <tr>
            <td style="height: 4px; background: linear-gradient(90deg, transparent, ${BRAND_COLORS.copper}, ${BRAND_COLORS.bronze}, ${BRAND_COLORS.golden}, ${BRAND_COLORS.bronze}, ${BRAND_COLORS.copper}, transparent); box-shadow: 0 0 20px rgba(184, 115, 51, 0.5);"></td>
          </tr>
          
          <!-- Header with Logo/Brand -->
          <tr>
            <td style="padding: 50px 40px 30px; text-align: center; background: linear-gradient(135deg, rgba(184, 115, 51, 0.1) 0%, rgba(205, 127, 50, 0.05) 100%);">
              <h1 style="margin: 0; font-family: 'Bebas Neue', Arial, sans-serif; font-size: 56px; font-weight: 400; letter-spacing: 0.08em; text-transform: uppercase; background: linear-gradient(135deg, ${BRAND_COLORS.copper} 0%, ${BRAND_COLORS.bronze} 50%, ${BRAND_COLORS.golden} 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; line-height: 1;">
                RABUSTE
              </h1>
              <p style="margin: 12px 0 0; font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase; color: ${BRAND_COLORS.copper}; font-weight: 600;">
                UNAPOLOGETICALLY BOLD
              </p>
              <div style="margin: 25px auto 0; width: 80px; height: 2px; background: linear-gradient(90deg, transparent, ${BRAND_COLORS.copper}, transparent);"></div>
            </td>
          </tr>
          
          <!-- AI Badge -->
          <tr>
            <td style="padding: 0 40px 30px; text-align: center;">
              <div style="display: inline-block; padding: 8px 20px; background: rgba(184, 115, 51, 0.15); border: 1px solid ${BRAND_COLORS.copper}; border-radius: 20px;">
                <span style="font-size: 11px; letter-spacing: 0.15em; color: ${BRAND_COLORS.golden}; font-weight: 700; text-transform: uppercase;">
                  AI-POWERED EXPERIENCE
                </span>
              </div>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 0 40px 50px;">
              ${content}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 40px; background: linear-gradient(180deg, transparent, rgba(26, 17, 16, 0.8)); border-top: 1px solid rgba(184, 115, 51, 0.2);">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="text-align: center; padding-bottom: 20px;">
                    <p style="margin: 0 0 15px; font-size: 13px; letter-spacing: 0.15em; color: ${BRAND_COLORS.copper}; font-weight: 600; text-transform: uppercase;">
                      2X CAFFEINE | PREMIUM ROBUSTA
                    </p>
                    <p style="margin: 0; font-size: 12px; line-height: 1.6; color: ${BRAND_COLORS.cream}; opacity: 0.7;">
                      Bold. Intense. Powerful.<br>
                      The coffee that doesn't apologize.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="text-align: center; padding-top: 20px; border-top: 1px solid rgba(184, 115, 51, 0.1);">
                    <p style="margin: 0; font-size: 11px; color: ${BRAND_COLORS.cream}; opacity: 0.5; line-height: 1.5;">
                      © ${new Date().getFullYear()} Rabuste. All rights reserved.<br>
                      Questions? Reply to this email or visit our café.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Bottom Copper Border -->
          <tr>
            <td style="height: 4px; background: linear-gradient(90deg, transparent, ${BRAND_COLORS.copper}, ${BRAND_COLORS.bronze}, ${BRAND_COLORS.golden}, ${BRAND_COLORS.bronze}, ${BRAND_COLORS.copper}, transparent); box-shadow: 0 0 20px rgba(184, 115, 51, 0.5);"></td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// Order Confirmation Email Template
export const generateOrderConfirmationEmail = (order: {
  customerName: string;
  items: Array<{ name: string; quantity: number; price: number; itemType: string }>;
  totalAmount: number;
  instructions?: string;
  orderId: string;
}) => {
  const itemsList = order.items.map(item => `
    <tr>
      <td style="padding: 15px 20px; border-bottom: 1px solid rgba(184, 115, 51, 0.1); background: rgba(245, 241, 232, 0.02);">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
          <tr>
            <td style="width: 70%;">
              <p style="margin: 0 0 5px; font-size: 15px; font-weight: 600; color: ${BRAND_COLORS.warmWhite};">
                ${item.name}
              </p>
              <p style="margin: 0; font-size: 12px; color: ${BRAND_COLORS.copper}; text-transform: uppercase; letter-spacing: 0.1em;">
                ${item.itemType === 'menu' ? 'Menu Item' : 'Art Piece'}
              </p>
            </td>
            <td style="width: 15%; text-align: center; font-size: 14px; color: ${BRAND_COLORS.cream};">
              × ${item.quantity}
            </td>
            <td style="width: 15%; text-align: right; font-size: 15px; font-weight: 700; color: ${BRAND_COLORS.golden};">
              ₹${item.price * item.quantity}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `).join('');

  const content = `
    <div style="text-align: center; margin-bottom: 35px;">
      <h2 style="margin: 0 0 15px; font-family: 'Bebas Neue', Arial, sans-serif; font-size: 42px; font-weight: 400; letter-spacing: 0.05em; text-transform: uppercase; color: ${BRAND_COLORS.warmWhite}; line-height: 1.1;">
        ORDER CONFIRMED
      </h2>
      <p style="margin: 0; font-size: 15px; color: ${BRAND_COLORS.cream}; opacity: 0.8; line-height: 1.6;">
        Hey <strong style="color: ${BRAND_COLORS.golden};">${order.customerName}</strong>, your bold choice is being prepared!
      </p>
    </div>

    <!-- Order ID Card -->
    <div style="background: rgba(184, 115, 51, 0.1); border: 1px solid ${BRAND_COLORS.copper}; border-radius: 8px; padding: 20px; margin-bottom: 30px; text-align: center;">
      <p style="margin: 0 0 8px; font-size: 11px; letter-spacing: 0.15em; color: ${BRAND_COLORS.copper}; text-transform: uppercase; font-weight: 600;">
        Order ID
      </p>
      <p style="margin: 0; font-family: 'Courier New', monospace; font-size: 18px; font-weight: 700; color: ${BRAND_COLORS.golden}; letter-spacing: 0.05em;">
        #${order.orderId.slice(-8).toUpperCase()}
      </p>
    </div>

    <!-- Order Items -->
    <div style="margin-bottom: 30px;">
      <p style="margin: 0 0 20px; font-size: 13px; letter-spacing: 0.15em; color: ${BRAND_COLORS.copper}; text-transform: uppercase; font-weight: 600;">
        YOUR ORDER
      </p>
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border: 1px solid rgba(184, 115, 51, 0.2); border-radius: 8px; overflow: hidden;">
        ${itemsList}
        <tr>
          <td style="padding: 25px 20px; background: linear-gradient(135deg, rgba(184, 115, 51, 0.2), rgba(205, 127, 50, 0.1)); border-top: 2px solid ${BRAND_COLORS.copper};">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
              <tr>
                <td style="font-size: 16px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: ${BRAND_COLORS.warmWhite};">
                  TOTAL
                </td>
                <td style="text-align: right; font-family: 'Bebas Neue', Arial, sans-serif; font-size: 32px; font-weight: 400; color: ${BRAND_COLORS.golden};">
                  ₹${order.totalAmount}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>

    ${order.instructions ? `
    <!-- Special Instructions -->
    <div style="background: rgba(26, 17, 16, 0.6); border-left: 3px solid ${BRAND_COLORS.copper}; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
      <p style="margin: 0 0 10px; font-size: 11px; letter-spacing: 0.15em; color: ${BRAND_COLORS.copper}; text-transform: uppercase; font-weight: 600;">
        SPECIAL INSTRUCTIONS
      </p>
      <p style="margin: 0; font-size: 14px; color: ${BRAND_COLORS.cream}; line-height: 1.6; font-style: italic;">
        "${order.instructions}"
      </p>
    </div>
    ` : ''}

    <!-- Next Steps -->
    <div style="background: linear-gradient(135deg, rgba(184, 115, 51, 0.15), rgba(205, 127, 50, 0.05)); border: 1px solid rgba(184, 115, 51, 0.3); border-radius: 8px; padding: 25px; margin-top: 35px;">
      <p style="margin: 0 0 15px; font-size: 15px; font-weight: 700; color: ${BRAND_COLORS.golden}; text-transform: uppercase; letter-spacing: 0.1em;">
        What's Next?
      </p>
      <p style="margin: 0; font-size: 14px; color: ${BRAND_COLORS.cream}; line-height: 1.7;">
        Our AI-powered system is optimizing your brew for maximum boldness. We'll notify you the moment your order is ready for pickup. Get ready for an unapologetically intense experience!
      </p>
    </div>

    <!-- CTA -->
    <div style="text-align: center; margin-top: 35px;">
      <p style="margin: 0 0 20px; font-size: 13px; color: ${BRAND_COLORS.cream}; opacity: 0.7;">
        Track your order status anytime
      </p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/order-status" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, ${BRAND_COLORS.copper} 0%, ${BRAND_COLORS.bronze} 50%, ${BRAND_COLORS.golden} 100%); color: #000000; text-decoration: none; font-family: 'Bebas Neue', Arial, sans-serif; font-size: 16px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; border-radius: 4px; box-shadow: 0 10px 30px rgba(184, 115, 51, 0.4);">
        TRACK ORDER
      </a>
    </div>
  `;

  return getEmailTemplate(content);
};

// Order Ready Email Template
export const generateOrderReadyEmail = (order: {
  customerName: string;
  items: Array<{ name: string; quantity: number }>;
  totalAmount: number;
  orderId: string;
}) => {
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  const content = `
    <div style="text-align: center; margin-bottom: 35px;">
      <h2 style="margin: 0 0 15px; font-family: 'Bebas Neue', Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 0.05em; text-transform: uppercase; background: linear-gradient(135deg, ${BRAND_COLORS.copper} 0%, ${BRAND_COLORS.golden} 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; line-height: 1.1;">
        IT'S BREW TIME!
      </h2>
      <p style="margin: 0; font-size: 16px; color: ${BRAND_COLORS.cream}; line-height: 1.6;">
        <strong style="color: ${BRAND_COLORS.golden};">${order.customerName}</strong>, your bold order is ready to unleash its power!
      </p>
    </div>

    <!-- Order Ready Card -->
    <div style="background: linear-gradient(135deg, rgba(184, 115, 51, 0.2), rgba(205, 127, 50, 0.1)); border: 2px solid ${BRAND_COLORS.copper}; border-radius: 12px; padding: 30px; margin-bottom: 30px; text-align: center; box-shadow: 0 0 40px rgba(184, 115, 51, 0.3);">
      <p style="margin: 0 0 15px; font-size: 13px; letter-spacing: 0.2em; color: ${BRAND_COLORS.copper}; text-transform: uppercase; font-weight: 700;">
        STATUS: READY FOR PICKUP
      </p>
      <p style="margin: 0 0 10px; font-family: 'Courier New', monospace; font-size: 16px; color: ${BRAND_COLORS.cream}; opacity: 0.8;">
        Order #${order.orderId.slice(-8).toUpperCase()}
      </p>
      <div style="margin: 20px 0; padding: 20px; background: rgba(0, 0, 0, 0.3); border-radius: 8px;">
        <p style="margin: 0 0 8px; font-size: 11px; letter-spacing: 0.15em; color: ${BRAND_COLORS.copper}; text-transform: uppercase;">
          Your Order
        </p>
        <p style="margin: 0; font-size: 28px; font-weight: 700; color: ${BRAND_COLORS.golden};">
          ${itemCount} ${itemCount === 1 ? 'Item' : 'Items'}
        </p>
      </div>
    </div>

    <!-- Pickup Instructions -->
    <div style="background: rgba(26, 17, 16, 0.6); border-left: 4px solid ${BRAND_COLORS.golden}; padding: 25px; margin-bottom: 30px; border-radius: 4px;">
      <p style="margin: 0 0 15px; font-size: 15px; font-weight: 700; color: ${BRAND_COLORS.golden}; text-transform: uppercase; letter-spacing: 0.1em;">
        PICKUP READY
      </p>
      <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: ${BRAND_COLORS.cream}; line-height: 2;">
        <li>Head to the counter and show this email or your order ID</li>
        <li>Our barista will have your perfectly crafted order waiting</li>
        <li>Prepare your taste buds for an intense, unapologetic experience</li>
      </ul>
    </div>

    <!-- AI Optimization Note -->
    <div style="text-align: center; padding: 25px; background: linear-gradient(135deg, rgba(184, 115, 51, 0.1), rgba(205, 127, 50, 0.05)); border: 1px solid rgba(184, 115, 51, 0.2); border-radius: 8px; margin-bottom: 30px;">
      <p style="margin: 0 0 12px; font-size: 12px; letter-spacing: 0.15em; color: ${BRAND_COLORS.copper}; text-transform: uppercase; font-weight: 600;">
        AI-OPTIMIZED BREW
      </p>
      <p style="margin: 0; font-size: 14px; color: ${BRAND_COLORS.cream}; line-height: 1.6; opacity: 0.9;">
        Your order has been crafted using our AI-powered brewing system for peak flavor intensity and 2X caffeine delivery. Bold doesn't compromise.
      </p>
    </div>

    <!-- Total Amount -->
    <div style="text-align: center; padding: 25px; background: linear-gradient(135deg, rgba(184, 115, 51, 0.2), rgba(205, 127, 50, 0.1)); border-radius: 8px; border: 1px solid ${BRAND_COLORS.copper};">
      <p style="margin: 0 0 10px; font-size: 12px; letter-spacing: 0.15em; color: ${BRAND_COLORS.copper}; text-transform: uppercase; font-weight: 600;">
        TOTAL AMOUNT
      </p>
      <p style="margin: 0; font-family: 'Bebas Neue', Arial, sans-serif; font-size: 42px; font-weight: 400; color: ${BRAND_COLORS.golden};">
        ₹${order.totalAmount}
      </p>
    </div>

    <!-- Premium Note -->
    <div style="text-align: center; margin-top: 35px; padding-top: 30px; border-top: 1px solid rgba(184, 115, 51, 0.2);">
      <p style="margin: 0 0 15px; font-size: 15px; font-weight: 700; color: ${BRAND_COLORS.cream};">
        Thank you for choosing Rabuste!
      </p>
      <p style="margin: 0; font-size: 13px; color: ${BRAND_COLORS.cream}; opacity: 0.7; line-height: 1.6;">
        Every cup is a statement. Every sip is unapologetically bold.<br>
        <strong style="color: ${BRAND_COLORS.copper};">See you soon!</strong>
      </p>
    </div>
  `;

  return getEmailTemplate(content);
};

// Welcome Email Template
export const generateWelcomeEmail = (userName: string, userEmail: string) => {
  const content = `
    <div style="text-align: center; margin-bottom: 35px;">
      <h2 style="margin: 0 0 15px; font-family: 'Bebas Neue', Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 0.05em; text-transform: uppercase; background: linear-gradient(135deg, ${BRAND_COLORS.copper} 0%, ${BRAND_COLORS.golden} 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; line-height: 1.1;">
        WELCOME TO RABUSTE
      </h2>
      <p style="margin: 0; font-size: 16px; color: ${BRAND_COLORS.cream}; line-height: 1.6;">
        Hey <strong style="color: ${BRAND_COLORS.golden};">${userName}</strong>, you've just joined the boldest coffee community!
      </p>
    </div>

    <!-- Value Proposition -->
    <div style="background: linear-gradient(135deg, rgba(184, 115, 51, 0.15), rgba(205, 127, 50, 0.05)); border: 1px solid rgba(184, 115, 51, 0.3); border-radius: 12px; padding: 30px; margin-bottom: 30px;">
      <p style="margin: 0 0 20px; font-size: 15px; color: ${BRAND_COLORS.cream}; line-height: 1.8; text-align: center;">
        At Rabuste, we don't believe in ordinary. Our premium Robusta delivers <strong style="color: ${BRAND_COLORS.golden};">2X the caffeine</strong>, powered by AI-optimized brewing for an experience that's unapologetically intense.
      </p>
      <div style="text-align: center; padding: 20px; background: rgba(0, 0, 0, 0.3); border-radius: 8px;">
        <p style="margin: 0; font-size: 13px; letter-spacing: 0.2em; color: ${BRAND_COLORS.copper}; text-transform: uppercase; font-weight: 700;">
          YOUR COFFEE, REIMAGINED
        </p>
      </div>
    </div>

    <!-- What Makes Us Different -->
    <div style="margin-bottom: 30px;">
      <p style="margin: 0 0 25px; font-size: 13px; letter-spacing: 0.15em; color: ${BRAND_COLORS.copper}; text-transform: uppercase; font-weight: 600; text-align: center;">
        WHY RABUSTE?
      </p>
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
          <td style="padding: 20px; background: rgba(245, 241, 232, 0.02); border-left: 3px solid ${BRAND_COLORS.copper}; margin-bottom: 15px;">
            <p style="margin: 0 0 8px; font-size: 16px; font-weight: 700; color: ${BRAND_COLORS.golden};">
              2X Caffeine Power
            </p>
            <p style="margin: 0; font-size: 13px; color: ${BRAND_COLORS.cream}; opacity: 0.8; line-height: 1.6;">
              Premium Robusta beans scientifically proven to deliver double the energy
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding: 20px; background: rgba(245, 241, 232, 0.02); border-left: 3px solid ${BRAND_COLORS.bronze}; margin-bottom: 15px;">
            <p style="margin: 0 0 8px; font-size: 16px; font-weight: 700; color: ${BRAND_COLORS.golden};">
              AI-Optimized Brewing
            </p>
            <p style="margin: 0; font-size: 13px; color: ${BRAND_COLORS.cream}; opacity: 0.8; line-height: 1.6;">
              Every cup crafted to perfection using cutting-edge technology
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding: 20px; background: rgba(245, 241, 232, 0.02); border-left: 3px solid ${BRAND_COLORS.golden};">
            <p style="margin: 0 0 8px; font-size: 16px; font-weight: 700; color: ${BRAND_COLORS.golden};">
              Coffee + Art + Community
            </p>
            <p style="margin: 0; font-size: 13px; color: ${BRAND_COLORS.cream}; opacity: 0.8; line-height: 1.6;">
              More than coffee—it's a lifestyle, a statement, an experience
            </p>
          </td>
        </tr>
      </table>
    </div>

    <!-- CTA Section -->
    <div style="text-align: center; padding: 30px; background: linear-gradient(135deg, rgba(184, 115, 51, 0.2), rgba(205, 127, 50, 0.1)); border-radius: 8px; margin-top: 35px;">
      <p style="margin: 0 0 20px; font-size: 15px; font-weight: 700; color: ${BRAND_COLORS.golden}; text-transform: uppercase; letter-spacing: 0.1em;">
        READY TO EXPERIENCE BOLD?
      </p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/menu" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, ${BRAND_COLORS.copper} 0%, ${BRAND_COLORS.bronze} 50%, ${BRAND_COLORS.golden} 100%); color: #000000; text-decoration: none; font-family: 'Bebas Neue', Arial, sans-serif; font-size: 16px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; border-radius: 4px; box-shadow: 0 10px 30px rgba(184, 115, 51, 0.4); margin-bottom: 15px;">
        EXPLORE MENU
      </a>
      <p style="margin: 15px 0 0; font-size: 12px; color: ${BRAND_COLORS.cream}; opacity: 0.6;">
        Your first bold experience awaits
      </p>
    </div>

    <!-- Personal Touch -->
    <div style="text-align: center; margin-top: 35px; padding-top: 30px; border-top: 1px solid rgba(184, 115, 51, 0.2);">
      <p style="margin: 0; font-size: 14px; color: ${BRAND_COLORS.cream}; line-height: 1.7; font-style: italic;">
        "We're thrilled to have you, ${userName}. Get ready for coffee<br>
        that doesn't hold back. Unapologetically bold, always."
      </p>
      <p style="margin: 15px 0 0; font-size: 12px; letter-spacing: 0.1em; color: ${BRAND_COLORS.copper}; text-transform: uppercase;">
        — The Rabuste Team
      </p>
    </div>
  `;

  return getEmailTemplate(content);
};

// Generic email sender with branded template
export async function sendOrderEmail(
  to: string,
  subject: string,
  html: string
) {
  await transporter.sendMail({
    from: `"Rabuste - Unapologetically Bold" <${process.env.EMAIL_USER}>`,
    to,
    subject: `${subject} | Rabuste`,
    html,
  });
}

// Specific email functions for easy use
export async function sendOrderConfirmation(
  to: string,
  order: Parameters<typeof generateOrderConfirmationEmail>[0]
) {
  const html = generateOrderConfirmationEmail(order);
  await sendOrderEmail(to, "Order Confirmed", html);
}

export async function sendOrderReady(
  to: string,
  order: Parameters<typeof generateOrderReadyEmail>[0]
) {
  const html = generateOrderReadyEmail(order);
  await sendOrderEmail(to, "Your Order is Ready", html);
}

export async function sendWelcomeEmail(
  to: string,
  userName: string
) {
  const html = generateWelcomeEmail(userName, to);
  await sendOrderEmail(to, "Welcome to the Bold Side", html);
}

// Workshop Registration Email Template
export const generateWorkshopRegistrationEmail = (registration: {
  userName: string;
  workshopTitle: string;
  date: string;
  time: string;
  location: string;
  instructor: string;
  category: string;
  description?: string;
}) => {
  const formattedDate = new Date(registration.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const content = `
    <div style="text-align: center; margin-bottom: 35px;">
      <h2 style="margin: 0 0 15px; font-family: 'Bebas Neue', Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 0.05em; text-transform: uppercase; background: linear-gradient(135deg, ${BRAND_COLORS.copper} 0%, ${BRAND_COLORS.golden} 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; line-height: 1.1;">
        REGISTRATION CONFIRMED
      </h2>
      <p style="margin: 0; font-size: 16px; color: ${BRAND_COLORS.cream}; line-height: 1.6;">
        Hey <strong style="color: ${BRAND_COLORS.golden};">${registration.userName}</strong>, you're all set for an incredible workshop experience!
      </p>
    </div>

    <!-- Workshop Badge -->
    <div style="background: linear-gradient(135deg, rgba(184, 115, 51, 0.2), rgba(205, 127, 50, 0.1)); border: 2px solid ${BRAND_COLORS.copper}; border-radius: 12px; padding: 30px; margin-bottom: 30px; text-align: center; box-shadow: 0 0 40px rgba(184, 115, 51, 0.3);">
      <p style="margin: 0 0 15px; font-size: 11px; letter-spacing: 0.2em; color: ${BRAND_COLORS.copper}; text-transform: uppercase; font-weight: 700;">
        ${registration.category.toUpperCase()} WORKSHOP
      </p>
      <h3 style="margin: 0 0 20px; font-family: 'Bebas Neue', Arial, sans-serif; font-size: 36px; font-weight: 400; color: ${BRAND_COLORS.warmWhite}; line-height: 1.1; letter-spacing: 0.03em;">
        ${registration.workshopTitle}
      </h3>
      ${registration.description ? `
      <p style="margin: 0; font-size: 14px; color: ${BRAND_COLORS.cream}; opacity: 0.9; line-height: 1.6; padding: 0 20px;">
        ${registration.description}
      </p>
      ` : ''}
    </div>

    <!-- Workshop Details -->
    <div style="margin-bottom: 30px;">
      <p style="margin: 0 0 20px; font-size: 13px; letter-spacing: 0.15em; color: ${BRAND_COLORS.copper}; text-transform: uppercase; font-weight: 600; text-align: center;">
        WORKSHOP DETAILS
      </p>
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border: 1px solid rgba(184, 115, 51, 0.2); border-radius: 8px; overflow: hidden;">
        <tr>
          <td style="padding: 20px; border-bottom: 1px solid rgba(184, 115, 51, 0.1); background: rgba(245, 241, 232, 0.02);">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
              <tr>
                <td style="width: 30%; padding-right: 15px;">
                  <p style="margin: 0; font-size: 11px; letter-spacing: 0.15em; color: ${BRAND_COLORS.copper}; text-transform: uppercase; font-weight: 600;">
                    DATE
                  </p>
                </td>
                <td>
                  <p style="margin: 0; font-size: 15px; color: ${BRAND_COLORS.warmWhite}; font-weight: 600;">
                    ${formattedDate}
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding: 20px; border-bottom: 1px solid rgba(184, 115, 51, 0.1); background: rgba(245, 241, 232, 0.02);">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
              <tr>
                <td style="width: 30%; padding-right: 15px;">
                  <p style="margin: 0; font-size: 11px; letter-spacing: 0.15em; color: ${BRAND_COLORS.copper}; text-transform: uppercase; font-weight: 600;">
                    TIME
                  </p>
                </td>
                <td>
                  <p style="margin: 0; font-size: 15px; color: ${BRAND_COLORS.warmWhite}; font-weight: 600;">
                    ${registration.time}
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding: 20px; border-bottom: 1px solid rgba(184, 115, 51, 0.1); background: rgba(245, 241, 232, 0.02);">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
              <tr>
                <td style="width: 30%; padding-right: 15px;">
                  <p style="margin: 0; font-size: 11px; letter-spacing: 0.15em; color: ${BRAND_COLORS.copper}; text-transform: uppercase; font-weight: 600;">
                    LOCATION
                  </p>
                </td>
                <td>
                  <p style="margin: 0; font-size: 15px; color: ${BRAND_COLORS.warmWhite}; font-weight: 600;">
                    ${registration.location}
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding: 20px; background: rgba(245, 241, 232, 0.02);">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
              <tr>
                <td style="width: 30%; padding-right: 15px;">
                  <p style="margin: 0; font-size: 11px; letter-spacing: 0.15em; color: ${BRAND_COLORS.copper}; text-transform: uppercase; font-weight: 600;">
                    INSTRUCTOR
                  </p>
                </td>
                <td>
                  <p style="margin: 0; font-size: 15px; color: ${BRAND_COLORS.warmWhite}; font-weight: 600;">
                    ${registration.instructor}
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>

    <!-- What to Bring -->
    <div style="background: rgba(26, 17, 16, 0.6); border-left: 4px solid ${BRAND_COLORS.golden}; padding: 25px; margin-bottom: 30px; border-radius: 4px;">
      <p style="margin: 0 0 15px; font-size: 15px; font-weight: 700; color: ${BRAND_COLORS.golden}; text-transform: uppercase; letter-spacing: 0.1em;">
        WHAT TO BRING
      </p>
      <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: ${BRAND_COLORS.cream}; line-height: 2;">
        <li>Arrive 10 minutes early to check in</li>
        <li>Bring your creativity and enthusiasm</li>
        <li>All materials and supplies will be provided</li>
        <li>Wear comfortable clothing you don't mind getting a little messy</li>
      </ul>
    </div>

    <!-- Premium Experience Note -->
    <div style="text-align: center; padding: 25px; background: linear-gradient(135deg, rgba(184, 115, 51, 0.1), rgba(205, 127, 50, 0.05)); border: 1px solid rgba(184, 115, 51, 0.2); border-radius: 8px; margin-bottom: 30px;">
      <p style="margin: 0 0 12px; font-size: 12px; letter-spacing: 0.15em; color: ${BRAND_COLORS.copper}; text-transform: uppercase; font-weight: 600;">
        PREMIUM WORKSHOP EXPERIENCE
      </p>
      <p style="margin: 0; font-size: 14px; color: ${BRAND_COLORS.cream}; line-height: 1.6; opacity: 0.9;">
        ${registration.category === 'coffee' 
          ? 'Master the art of bold coffee brewing with our expert baristas. Learn techniques used in our AI-optimized brewing system and discover the secrets behind our 2X caffeine power.'
          : 'Unleash your creativity in this hands-on painting workshop. Explore bold techniques and vibrant expressions in a supportive, inspiring environment.'
        }
      </p>
    </div>

    <!-- Important Reminder -->
    <div style="background: linear-gradient(135deg, rgba(184, 115, 51, 0.15), rgba(205, 127, 50, 0.05)); border: 1px solid rgba(184, 115, 51, 0.3); border-radius: 8px; padding: 25px; margin-top: 35px;">
      <p style="margin: 0 0 15px; font-size: 15px; font-weight: 700; color: ${BRAND_COLORS.golden}; text-transform: uppercase; letter-spacing: 0.1em;">
        IMPORTANT REMINDER
      </p>
      <p style="margin: 0; font-size: 14px; color: ${BRAND_COLORS.cream}; line-height: 1.7;">
        This confirmation email is your ticket to the workshop. If you need to cancel or have any questions, please reply to this email or contact us at least 24 hours before the event. We're excited to see you there!
      </p>
    </div>

    <!-- Thank You -->
    <div style="text-align: center; margin-top: 35px; padding-top: 30px; border-top: 1px solid rgba(184, 115, 51, 0.2);">
      <p style="margin: 0 0 15px; font-size: 15px; font-weight: 700; color: ${BRAND_COLORS.cream};">
        Thank you for joining us!
      </p>
      <p style="margin: 0; font-size: 13px; color: ${BRAND_COLORS.cream}; opacity: 0.7; line-height: 1.6;">
        Get ready for an unapologetically bold learning experience.<br>
        <strong style="color: ${BRAND_COLORS.copper};">See you at the workshop!</strong>
      </p>
    </div>
  `;

  return getEmailTemplate(content);
};

// Send Workshop Registration Email
export async function sendWorkshopRegistrationEmail(
  to: string,
  registration: Parameters<typeof generateWorkshopRegistrationEmail>[0]
) {
  const html = generateWorkshopRegistrationEmail(registration);
  await sendOrderEmail(to, "Workshop Registration Confirmed", html);
}