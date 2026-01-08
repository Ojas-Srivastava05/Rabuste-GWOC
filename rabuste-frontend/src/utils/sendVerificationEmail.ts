import nodemailer from "nodemailer";

export async function sendVerificationEmail(
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
    subject: "Verify your Rabuste account",
    html: `
      <h2>Your verification code</h2>
      <h1 style="letter-spacing:4px">${code}</h1>
      <p>This code expires in 10 minutes.</p>
    `,
  });
}
