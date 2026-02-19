import { createTransporter } from "@/lib/email/transporter";

export function createSmtpTransport() {
  return createTransporter();
}

export async function sendOtpEmail({ to, otp, siteName = "Admin" }) {
  const transporter = createSmtpTransport();
  const fromUser = process.env.SMTP_MAIL || process.env.NEXT_PUBLIC_SMTP_MAIL;

  await transporter.sendMail({
    from: `"${siteName}" <${fromUser}>`,
    to,
    subject: `${siteName} login OTP`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 16px;">
        <h2 style="margin: 0 0 12px; color:#2367f8;">${siteName} Admin Login</h2>
        <p style="margin: 0 0 8px;">Your OTP is:</p>
        <div style="font-size: 28px; letter-spacing: 6px; font-weight: 700; padding: 12px 16px; background: #f3f4f6; border-radius: 8px; display:inline-block;">
          ${otp}
        </div>
        <p style="margin: 12px 0 0; color:#666; font-size: 13px;">This OTP expires soon. If you didnƒ?Tt request it, you can ignore this email.</p>
      </div>
    `,
  });
}

