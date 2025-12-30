import nodemailer from "nodemailer";
import User from "../models/Users";

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER?.trim(),
    pass: process.env.EMAIL_PASS?.trim(),
  },
});

interface MenuItem {
  name: string;
  description?: string;
  price: number;
  image?: string;
  category: string;
}

interface ArtworkItem {
  title: string;
  artist?: string;
  description?: string;
  images?: string[];
  price?: number;
}

interface UserData {
  email: string;
  name?: string;
}

/**
 * Send notification email to all verified users
 * @param type - 'menu' or 'artwork'
 * @param item - The new menu item or artwork
 */
export const notifyUsers = async (
  type: 'menu' | 'artwork',
  item: MenuItem | ArtworkItem
): Promise<{ success: boolean; message: string }> => {
  try {
    // Get all verified users
    const users = await User.find({ isVerified: true }).select('email name');
    
    if (users.length === 0) {
      return { success: true, message: 'No users to notify' };
    }

    // Create email content based on type
    const emailContent = type === 'menu' 
      ? createMenuEmailContent(item as MenuItem)
      : createArtworkEmailContent(item as ArtworkItem);

    const subject = type === 'menu'
      ? `☕ New on the Menu: ${(item as MenuItem).name}`
      : `🎨 New Artwork Added: ${(item as ArtworkItem).title}`;

    // Send emails to all users (in batches to avoid rate limits)
    const batchSize = 50;
    const batches = Math.ceil(users.length / batchSize);

    for (let i = 0; i < batches; i++) {
      const batch = users.slice(i * batchSize, (i + 1) * batchSize);
      
      const emailPromises = batch.map(user => 
        transporter.sendMail({
          from: `"Rabuste Coffee" <${process.env.EMAIL_USER?.trim()}>`,
          to: user.email,
          subject: subject,
          html: emailContent(user),
        }).catch(err => {
          return null;
        })
      );

      await Promise.all(emailPromises);

      // Small delay between batches
      if (i < batches - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return { success: true, message: `Notified ${users.length} users` };

  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

/**
 * Create email HTML for new menu item
 */
const createMenuEmailContent = (item: MenuItem) => (user: UserData) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Montserrat', Arial, sans-serif; background-color: #0a0a0a;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #1a1a1a;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #D4A574 0%, #B8860B 100%); padding: 40px 20px; text-align: center;">
      <div style="font-size: 48px; margin-bottom: 10px;">☕</div>
      <h1 style="color: #ffffff; margin: 0; font-size: 28px; text-transform: uppercase; letter-spacing: 3px;">
        New on the Menu!
      </h1>
    </div>

    <!-- Content -->
    <div style="padding: 40px 30px; color: #e0e0e0;">
      <div style="font-size: 18px; margin-bottom: 20px; color: #D4A574;">
        Hello ${user.name || 'Coffee Lover'},
      </div>

      <p style="font-size: 16px; line-height: 1.8; color: #e0e0e0;">
        We're excited to share something special with you! Our talented baristas have crafted a new addition to the Rabuste Coffee menu.
      </p>

      <!-- Item Card -->
      <div style="background: linear-gradient(135deg, #2a2a2a 0%, #1f1f1f 100%); border: 2px solid #D4A574; border-radius: 12px; padding: 25px; margin: 25px 0;">
        ${item.image ? `<img src="${item.image}" alt="${item.name}" style="width: 100%; max-width: 400px; height: 250px; object-fit: cover; border-radius: 8px; margin-bottom: 20px;" />` : ''}
        
        <div style="color: #D4A574; font-size: 26px; font-weight: bold; margin: 15px 0; text-transform: uppercase; letter-spacing: 2px;">
          ${item.name}
        </div>
        
        <span style="display: inline-block; background-color: #D4A574; color: #0a0a0a; padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin: 10px 0;">
          ${item.category}
        </span>
        
        ${item.description ? `<p style="color: #b0b0b0; font-size: 16px; line-height: 1.6; margin: 15px 0;">${item.description}</p>` : ''}
        
        <div style="display: flex; justify-content: space-between; margin: 20px 0; padding: 15px; background-color: rgba(212, 165, 116, 0.1); border-radius: 8px;">
          <div style="text-align: center;">
            <div style="color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Price</div>
            <div style="color: #D4A574; font-size: 20px; font-weight: bold; margin-top: 5px;">₹${item.price}</div>
          </div>
        </div>
      </div>

      <p style="font-size: 16px; line-height: 1.8; color: #e0e0e0; margin-top: 25px;">
        Visit us today to experience this incredible new addition to our menu. Your perfect cup of coffee awaits!
      </p>

      <center>
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}" style="display: inline-block; background: linear-gradient(135deg, #D4A574 0%, #B8860B 100%); color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-weight: bold; font-size: 16px; text-transform: uppercase; letter-spacing: 2px; margin: 25px 0;">
          Visit Our Menu
        </a>
      </center>
    </div>

    <!-- Footer -->
    <div style="background-color: #0f0f0f; padding: 30px; text-align: center; color: #666; font-size: 12px; border-top: 2px solid #D4A574;">
      <p style="margin: 10px 0; color: #999;">
        <strong style="color: #D4A574;">RABUSTE COFFEE</strong><br>
        Premium Specialty Coffee
      </p>
      <p style="margin: 10px 0;">
        📍 Find us at your nearest location<br>
        📧 Email: <a href="mailto:${process.env.EMAIL_USER}" style="color: #D4A574; text-decoration: none;">contact@rabustecoffee.com</a>
      </p>
      <p style="margin: 20px 0; font-size: 11px;">
        You're receiving this email because you're a valued member of the Rabuste Coffee community.
      </p>
      <p style="margin: 10px 0; font-size: 11px;">
        © ${new Date().getFullYear()} Rabuste Coffee. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
`;

/**
 * Create email HTML for new artwork
 */
const createArtworkEmailContent = (item: ArtworkItem) => (user: UserData) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Montserrat', Arial, sans-serif; background-color: #0a0a0a;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #1a1a1a;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #D4A574 0%, #B8860B 100%); padding: 40px 20px; text-align: center;">
      <div style="font-size: 48px; margin-bottom: 10px;">🎨</div>
      <h1 style="color: #ffffff; margin: 0; font-size: 28px; text-transform: uppercase; letter-spacing: 3px;">
        New Artwork Added!
      </h1>
    </div>

    <!-- Content -->
    <div style="padding: 40px 30px; color: #e0e0e0;">
      <div style="font-size: 18px; margin-bottom: 20px; color: #D4A574;">
        Hello ${user.name || 'Art Enthusiast'},
      </div>

      <p style="font-size: 16px; line-height: 1.8; color: #e0e0e0;">
        We're thrilled to showcase a stunning new piece of art at Rabuste Coffee. Our gallery continues to grow with incredible works from talented artists.
      </p>

      <!-- Art Card -->
      <div style="background: linear-gradient(135deg, #2a2a2a 0%, #1f1f1f 100%); border: 2px solid #D4A574; border-radius: 12px; padding: 25px; margin: 25px 0;">
        ${item.images && item.images[0] ? `<img src="${item.images[0]}" alt="${item.title}" style="width: 100%; max-width: 500px; height: auto; border-radius: 8px; margin-bottom: 20px;" />` : ''}
        
        <div style="color: #D4A574; font-size: 26px; font-weight: bold; margin: 15px 0; text-transform: uppercase; letter-spacing: 2px;">
          ${item.title}
        </div>
        
        ${item.artist ? `<div style="color: #b8860b; font-size: 18px; font-style: italic; margin: 10px 0;">By ${item.artist}</div>` : ''}
        
        ${item.description ? `<p style="color: #b0b0b0; font-size: 16px; line-height: 1.6; margin: 15px 0;">${item.description}</p>` : ''}
        
        ${item.price ? `
          <center>
            <div style="display: inline-block; background-color: #D4A574; color: #0a0a0a; padding: 12px 24px; border-radius: 8px; font-size: 20px; font-weight: bold; margin: 15px 0;">₹${item.price.toLocaleString()}</div>
          </center>
        ` : ''}
      </div>

      <p style="font-size: 16px; line-height: 1.8; color: #e0e0e0; margin-top: 25px;">
        Visit our café to experience this beautiful artwork in person. Art and coffee – the perfect blend!
      </p>

      <center>
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}" style="display: inline-block; background: linear-gradient(135deg, #D4A574 0%, #B8860B 100%); color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-weight: bold; font-size: 16px; text-transform: uppercase; letter-spacing: 2px; margin: 25px 0;">
          View Gallery
        </a>
      </center>
    </div>

    <!-- Footer -->
    <div style="background-color: #0f0f0f; padding: 30px; text-align: center; color: #666; font-size: 12px; border-top: 2px solid #D4A574;">
      <p style="margin: 10px 0; color: #999;">
        <strong style="color: #D4A574;">RABUSTE COFFEE</strong><br>
        Where Art Meets Coffee
      </p>
      <p style="margin: 10px 0;">
        📍 Find us at your nearest location<br>
        📧 Email: <a href="mailto:${process.env.EMAIL_USER}" style="color: #D4A574; text-decoration: none;">contact@rabustecoffee.com</a>
      </p>
      <p style="margin: 20px 0; font-size: 11px;">
        You're receiving this email because you're a valued member of the Rabuste Coffee community.
      </p>
      <p style="margin: 10px 0; font-size: 11px;">
        © ${new Date().getFullYear()} Rabuste Coffee. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
`;