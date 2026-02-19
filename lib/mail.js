import { createTransporter } from "@/lib/email/transporter";

export async function sendMail({ to, subject, html, text }) {
  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: `"${process.env.SMTP_MAIL}" <${process.env.SMTP_MAIL}>`,
      to,
      subject,
      html,
      text,
    });

    console.log("Email sent:", info.messageId);
    return true;
  } catch (err) {
    console.error("Email failed:", err);
    throw err;
  }
}
