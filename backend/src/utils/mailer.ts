import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password
  },
});

export const sendOtpEmail = async (toEmail: string, otp: string): Promise<void> => {
  await transporter.sendMail({
    from: `"ChatWithPDF" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Your Email Verification OTP",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px; border: 1px solid #eee; border-radius: 12px;">
        <h2 style="color: #4F1C51;">Verify Your Email</h2>
        <p>Use the OTP below to verify your email address. It expires in <strong>10 minutes</strong>.</p>
        <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #4F1C51; text-align: center; padding: 20px 0;">
          ${otp}
        </div>
        <p style="color: #888; font-size: 13px;">If you did not request this, please ignore this email.</p>
      </div>
    `,
  });
};