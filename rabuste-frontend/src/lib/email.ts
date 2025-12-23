import * as nodemailer from "nodemailer";

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  throw new Error("EMAIL_USER or EMAIL_PASS not defined");
}

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
    from: `"Coffee Shop" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
}
