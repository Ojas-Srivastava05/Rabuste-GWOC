import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendOrderEmail(
  to: string,
  subject: string,
  html: string
) {
  await transporter.sendMail({
    from: `"Coffee Shop ☕" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
}
