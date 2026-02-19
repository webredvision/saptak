import nodemailer from "nodemailer";

/**
 * Unified Email Transporter
 * Used by all forms across the application
 */

// Create reusable transporter
export const createTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASS,
    },
  });
};

/**
 * Send email with HTML support
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text content
 * @param {string} options.html - HTML content (optional)
 * @param {string} options.from - Sender name (optional)
 */
export const sendEmail = async ({
  to,
  subject,
  text,
  html,
  from,
  attachments,
}) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from:
        from ||
        `"${process.env.NEXT_PUBLIC_SITE_NAME || "Wealth Elite"}" <${process.env.SMTP_MAIL}>`,
      to,
      subject,
      text,
      html: html || text,
      attachments,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

/**
 * Send email to admin
 * @param {string} subject - Email subject
 * @param {string} content - Email content
 */
export const sendAdminEmail = async (subject, content) => {
  const adminEmail = process.env.SMTP_MAIL;
  return sendEmail({
    to: adminEmail,
    subject,
    text: content,
    html: content,
  });
};

/**
 * Email templates
 */
export const emailTemplates = {
  // Contact form template
  contactForm: (data) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">New Contact Form Submission</h2>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;"><strong>Name:</strong></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${data.name}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;"><strong>Email:</strong></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${data.email}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;"><strong>Mobile:</strong></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${data.mobile}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;"><strong>Message:</strong></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${data.message}</td>
                </tr>
            </table>
        </div>
    `,

  // Feedback template
  feedback: (data) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">New Feedback Received</h2>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;"><strong>Rating:</strong></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${"*".repeat(data.rating)}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;"><strong>Experience:</strong></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${data.experience}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;"><strong>Comments:</strong></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${data.comments}</td>
                </tr>
            </table>
        </div>
    `,

  // Meeting booking confirmation
  bookingConfirmation: (data) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Meeting Booking Confirmation</h2>
            <p>Dear ${data.name},</p>
            <p>Your meeting has been successfully booked!</p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;"><strong>Date:</strong></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${data.date}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;"><strong>Time:</strong></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${data.time}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;"><strong>Email:</strong></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${data.email}</td>
                </tr>
            </table>
            <p><strong>Meeting Link:</strong> ${
              data.meetLink
                ? `<a href="${data.meetLink}">${data.meetLink}</a>`
                : "Not available"
            }</p>
            <p>We look forward to meeting with you!</p>
        </div>
    `,

  // Bot lead notification
  botLead: (data) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">New Lead from WhatsApp Bot</h2>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;"><strong>Name:</strong></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${data.name}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;"><strong>Mobile:</strong></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${data.mobile}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;"><strong>Email:</strong></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${data.email}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;"><strong>Address:</strong></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${data.address}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;"><strong>Services:</strong></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${data.services?.join(", ") || "N/A"}</td>
                </tr>
            </table>
        </div>
    `,

  // Financial Health Assessment template
  financialHealth: (data, isUser = false) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">${isUser ? "Your Financial Health Score" : "New Financial Health Assessment"}</h2>
            <p>${isUser ? "Hello " + data.user.username + ", here are your assessment results:" : "A new assessment has been completed by " + data.user.username + "."}</p>
            <div style="background: #f4f4f4; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                <h1 style="margin: 0; color: #22c55e;">${data.score} / 100</h1>
                <p style="font-size: 18px; color: #666; margin-top: 10px;">Profile: <strong>${data.healthprofile}</strong></p>
            </div>
            <h3>Assessment Details:</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Email:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.user.email}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Mobile:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.user.mobile}</td></tr>
            </table>
            ${Array.isArray(data.answers) && data.answers.length
              ? `
                <h3>Questions & Answers</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  ${data.answers
                    .map(
                      (a) => `
                        <tr>
                          <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Q:</strong> ${a.question || ""}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>A:</strong> ${a.selectedAnswerText || a.answer || ""} (${a.selectedAnswerMarks ?? a.mark ?? ""})</td>
                        </tr>
                      `,
                    )
                    .join("")}
                </table>
              `
              : ""}
        </div>
    `,

  // Risk Profile Assessment template
  riskProfile: (data, isUser = false) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">${isUser ? "Your Risk Profile Results" : "New Risk Profile Assessment"}</h2>
            <div style="background: #f4f4f4; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                <h1 style="margin: 0; color: #3b82f6;">${data.riskprofile || data.profile || "N/A"}</h1>
                <p style="font-size: 16px; color: #666; margin-top: 10px;">Score: <strong>${data.score ?? "N/A"}</strong></p>
                <p style="font-size: 16px; color: #666; margin-top: 10px;">${data.description || ""}</p>
            </div>
            <p><strong>Name:</strong> ${data.user.username}</p>
            <p><strong>Email:</strong> ${data.user.email}</p>
            ${Array.isArray(data.answers) && data.answers.length
              ? `
                <h3>Questions & Answers</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  ${data.answers
                    .map(
                      (a) => `
                        <tr>
                          <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Q:</strong> ${a.question || ""}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>A:</strong> ${a.selectedAnswerText || a.answer || ""} (${a.selectedAnswerMarks ?? a.mark ?? ""})</td>
                        </tr>
                      `,
                    )
                    .join("")}
                </table>
              `
              : ""}
        </div>
    `,
};
