export const buildBookingEmail = ({ name, email, date, time, meetLink }) => {
  const subject = "Meeting Booking Confirmation";
  const text = `Your meeting is booked for ${date} at ${time}.`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Meeting Booking Confirmation</h2>
      <p>Dear ${name},</p>
      <p>Your meeting has been successfully booked!</p>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;"><strong>Date:</strong></td>
          <td style="padding: 10px; border: 1px solid #ddd;">${date}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;"><strong>Time:</strong></td>
          <td style="padding: 10px; border: 1px solid #ddd;">${time}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;"><strong>Email:</strong></td>
          <td style="padding: 10px; border: 1px solid #ddd;">${email}</td>
        </tr>
      </table>
      <p>We look forward to meeting with you!</p>
    </div>
  `;

  return { subject, text, html };
};

export const buildAdminBookingEmail = ({
  name,
  email,
  date,
  time,
}) => {
  const subject = "New Meeting Booking";
  const text = `New meeting booked by ${name} (${email}) on ${date} at ${time}.`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">New Meeting Booked</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Date:</strong> ${date}</p>
      <p><strong>Time:</strong> ${time}</p>
    </div>
  `;

  return { subject, text, html };
};
