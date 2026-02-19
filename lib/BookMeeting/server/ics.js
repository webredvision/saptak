const escapeIcsText = (value) => {
  if (!value) return "";
  return String(value)
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
};

const formatIcsDate = (date) =>
  date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");

export const buildMeetingIcs = ({
  start,
  end,
  name,
  email,
  organizerEmail,
  organizerName,
  meetLink,
  uid,
}) => {
  const title = `Meeting with ${name}`;
  const description = meetLink
    ? `Scheduled via Meeting Scheduler App. Meeting link: ${meetLink}`
    : "Scheduled via Meeting Scheduler App.";

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Book Meeting//Meeting//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${escapeIcsText(uid)}`,
    `DTSTAMP:${formatIcsDate(new Date())}`,
    `DTSTART:${formatIcsDate(start)}`,
    `DTEND:${formatIcsDate(end)}`,
    `SUMMARY:${escapeIcsText(title)}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
    organizerEmail
      ? `ORGANIZER;CN=${escapeIcsText(
          organizerName || "Organizer",
        )}:MAILTO:${organizerEmail}`
      : null,
    email
      ? `ATTENDEE;CN=${escapeIcsText(
          name || "Attendee",
        )};RSVP=TRUE:MAILTO:${email}`
      : null,
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);

  return lines.join("\r\n");
};
