import { sendEmail as sendEmailCore } from "@/lib/email/transporter";

// Backward-compatible wrapper
export const sendEmail = async (to, subject, text) => {
  return sendEmailCore({
    to,
    subject,
    text,
  });
};
