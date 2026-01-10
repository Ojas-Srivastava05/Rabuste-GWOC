import nodemailer from "nodemailer";

export async function sendResetPasswordEmail(
  email: string,
  code: string
) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Reset your Rabuste password",
    html: `
      <h2>Password Reset Request</h2>
      <p>Your password reset code is:</p>
      <h1 style="letter-spacing:4px">${code}</h1>
      <p>This code expires in 10 minutes.</p>
    `,
  });
}
