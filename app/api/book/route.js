import { google } from "googleapis";
import { NextResponse } from "next/server";
import Slot from "@/lib/models/Slot";
import { ConnectDB } from "@/lib/db/ConnectDB";
import { sendEmail } from "@/lib/email/transporter";
import {
  buildAdminBookingEmail,
  buildBookingEmail,
} from "@/lib/BookMeeting/server/email";
import { buildMeetingIcs } from "@/lib/BookMeeting/server/ics";

function convertTo24Hour(timeStr) {
  // Example input: "10:30 AM" or "2:45 pm"
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (modifier?.toLowerCase() === "pm" && hours < 12) hours += 12;
  if (modifier?.toLowerCase() === "am" && hours === 12) hours = 0;

  // Always pad to 2 digits
  const hh = hours.toString().padStart(2, "0");
  const mm = (minutes || 0).toString().padStart(2, "0");

  return `${hh}:${mm}`;
}

function addHoursToTime(time24, hoursToAdd) {
  const [hh, mm] = time24.split(":").map(Number);
  let newHours = hh + hoursToAdd;
  let newMinutes = mm || 0;
  if (newHours >= 24) newHours -= 24;
  return `${newHours.toString().padStart(2, "0")}:${newMinutes
    .toString()
    .padStart(2, "0")}`;
}

export async function POST(req) {
  const { date, time, name, email } = await req.json();

  await ConnectDB();

  const hasServiceAccount =
    !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    !!process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  const hasRefreshToken =
    !!process.env.GOOGLE_CLIENT_ID &&
    !!process.env.GOOGLE_CLIENT_SECRET &&
    !!process.env.GOOGLE_REFRESH_TOKEN;

  // Validate Environment Variables
  if (!hasServiceAccount && !hasRefreshToken) {
    console.error("Missing Google API Credentials in .env");
    return NextResponse.json(
      {
        error:
          "Booking system is not configured correctly. Missing API credentials.",
      },
      { status: 500 },
    );
  }

  const existing = await Slot.findOne({ date, time });
  if (existing?.booked) {
    return NextResponse.json({ error: "Slot already booked" }, { status: 400 });
  }

  // Convert 12-hour format -> 24-hour
  const time24 = convertTo24Hour(time);

  // Create ISO timestamps in Asia/Kolkata (+05:30)
  const eventStart = new Date(`${date}T${time24}:00+05:30`);
  const eventEnd = new Date(eventStart.getTime() + 60 * 60 * 1000);

  if (isNaN(eventStart.getTime())) {
    return NextResponse.json(
      { error: "Invalid date or time format" },
      { status: 400 },
    );
  }

  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
  );
  if (eventStart.getTime() <= now.getTime()) {
    return NextResponse.json(
      { error: "Cannot book a meeting in the past." },
      { status: 400 },
    );
  }

  let calendar;
  let calendarId = process.env.GOOGLE_CALENDAR_ID || "primary";
  let useOAuth = false;

  if (hasRefreshToken) {
    try {
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI,
      );

      oauth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN?.replace(/['"]/g, ""),
      });

      calendar = google.calendar({ version: "v3", auth: oauth2Client });
      useOAuth = true;
    } catch (error) {
      console.error("OAuth setup error, falling back to service account:", error);
      useOAuth = false;
    }
  }

  if (!useOAuth) {
    if (!hasServiceAccount) {
      return NextResponse.json(
        {
          error:
            "Service account is required as a fallback but is not configured.",
        },
        { status: 500 },
      );
    }
    if (!process.env.GOOGLE_CALENDAR_ID) {
      return NextResponse.json(
        {
          error:
            "Service account is configured but GOOGLE_CALENDAR_ID is missing. Share a calendar with the service account and set GOOGLE_CALENDAR_ID.",
        },
        { status: 500 },
      );
    }

    const jwt = new google.auth.JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/calendar"],
    });

    await jwt.authorize();
    calendar = google.calendar({ version: "v3", auth: jwt });
    calendarId = process.env.GOOGLE_CALENDAR_ID;
  }

  const event = {
    summary: `Meeting with ${name}`,
    description: "Scheduled via Meeting Scheduler App",
    start: { dateTime: `${date}T${time24}:00`, timeZone: "Asia/Kolkata" },
    end: {
      dateTime: `${date}T${addHoursToTime(time24, 1)}:00`,
      timeZone: "Asia/Kolkata",
    },
  };

  if (useOAuth) {
    event.attendees = [{ email }, { email: process.env.SMTP_MAIL }];
    event.conferenceData = {
      createRequest: {
        requestId: `${date}-${time}`,
        conferenceSolutionKey: { type: "hangoutsMeet" },
      },
    };
  }

  let res;
  try {
    const insertParams = {
      calendarId,
      resource: event,
    };

    if (useOAuth) {
      insertParams.conferenceDataVersion = 1;
    }

    res = await calendar.events.insert(insertParams);
  } catch (error) {
    console.error(
      "Google Calendar API Error:",
      error.response?.data || error.message,
    );
    const isInvalidGrant = error.response?.data?.error === "invalid_grant";

    if (useOAuth && isInvalidGrant && hasServiceAccount) {
      const jwt = new google.auth.JWT({
        email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(
          /\\n/g,
          "\n",
        ),
        scopes: ["https://www.googleapis.com/auth/calendar"],
      });
      await jwt.authorize();
      calendar = google.calendar({ version: "v3", auth: jwt });
      calendarId = process.env.GOOGLE_CALENDAR_ID;

      const fallbackParams = {
        calendarId,
        resource: event,
      };

      res = await calendar.events.insert(fallbackParams);
    } else {
      const errorMsg = isInvalidGrant
        ? "Authentication error: The refresh token is invalid or expired. Re-generate it, or switch to a service account for long-term access."
        : `Failed to book meeting: ${error.message}`;
      return NextResponse.json({ error: errorMsg }, { status: 500 });
    }
  }

  const meetLink = res.data.hangoutLink;

  const slot = await Slot.create({
    date,
    time,
    booked: true,
    name,
    email,
    meetLink,
  });

  try {
    const organizerEmail = process.env.SMTP_MAIL;
    const organizerName = process.env.NEXT_PUBLIC_SITE_NAME || "Organizer";
    const bookingEmail = buildBookingEmail({
      name,
      email,
      date,
      time,
      meetLink,
      organizerEmail,
      organizerName,
    });
    const adminEmail = buildAdminBookingEmail({
      name,
      email,
      date,
      time,
    });
    const icsContent = buildMeetingIcs({
      start: eventStart,
      end: eventEnd,
      name,
      email,
      organizerEmail,
      organizerName,
      meetLink,
      uid: String(slot._id),
    });

    const attachments = [
      {
        filename: "meeting.ics",
        content: icsContent,
        contentType: "text/calendar; charset=utf-8; method=REQUEST",
      },
    ];

    await sendEmail({
      to: email,
      subject: bookingEmail.subject,
      html: bookingEmail.html,
      text: bookingEmail.text,
      attachments,
    });

    if (process.env.SMTP_MAIL) {
      await sendEmail({
        to: process.env.SMTP_MAIL,
        subject: adminEmail.subject,
        html: adminEmail.html,
        text: adminEmail.text,
        attachments,
      });
    }
  } catch (emailError) {
    console.error("Booking email error:", emailError);
  }

  return NextResponse.json({ success: true, meetLink, slot });
}
