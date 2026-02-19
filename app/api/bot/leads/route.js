import { ConnectDB } from "@/lib/db/ConnectDB";
import BotLeadsModel from "@/lib/models/Botlead";
import SiteSettingsModel from "@/lib/models/SiteSetting";
import { createTransporter } from "@/lib/email/transporter";
import { NextResponse } from "next/server";

// POST: Create a new lead
export async function POST(request) {
  try {
    await ConnectDB();

    const { name, mobile, email, address, services } = await request.json();

    if (!name || !mobile || !email) {
      return NextResponse.json(
        { message: "Required fields missing." },
        { status: 400 }
      );
    }

    const servicesText = Array.isArray(services)
      ? services.filter(Boolean).join(", ")
      : String(services || "");

    await BotLeadsModel.create({
      username: name,
      mobile,
      email,
      address,
      services: servicesText,
    });

    let emailSent = false;
    try {
      const site = await SiteSettingsModel.findOne()
        .select("email alternateEmail websiteName")
        .lean();

      const transporter = createTransporter();
      const fromUser = process.env.SMTP_MAIL || process.env.SMTP_MAIL;
      const to =
        site?.email ||
        site?.alternateEmail ||
        process.env.LEADS_NOTIFY_EMAIL ||
        process.env.SMTP_MAIL;
      if (to) {
        await transporter.verify();
        await transporter.sendMail({
          from: `"${site?.websiteName || "Website Bot"}" <${fromUser}>`,
          to,
          subject: `New WhatsApp Lead: ${name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 680px; margin: 0 auto; padding: 16px;">
              <h2 style="margin: 0 0 12px; color:#16a34a;">New WhatsApp Lead</h2>
              <table style="border-collapse: collapse; width: 100%;">
                <tr><td style="padding: 6px 0; color:#6b7280;">Name</td><td style="padding: 6px 0;"><b>${name}</b></td></tr>
                <tr><td style="padding: 6px 0; color:#6b7280;">Mobile</td><td style="padding: 6px 0;">${mobile}</td></tr>
                <tr><td style="padding: 6px 0; color:#6b7280;">Email</td><td style="padding: 6px 0;">${email}</td></tr>
                <tr><td style="padding: 6px 0; color:#6b7280;">City</td><td style="padding: 6px 0;">${address || "-"}</td></tr>
                <tr><td style="padding: 6px 0; color:#6b7280;">Services</td><td style="padding: 6px 0;">${servicesText || "-"}</td></tr>
              </table>
            </div>
          `,
          text: `New WhatsApp Lead\nName: ${name}\nMobile: ${mobile}\nEmail: ${email}\nCity: ${address || "-"}\nServices: ${servicesText || "-"}`,
        });
        emailSent = true;
      }
    } catch (error) {
      console.error("Error sending bot lead email:", error);
    }

    return NextResponse.json({ msg: "Created", emailSent }, { status: 201 });
  } catch (error) {
    console.error("POST lead error:", error);
    return NextResponse.json({ msg: "Error saving lead." }, { status: 500 });
  }
}

// GET: Fetch all leads
export async function GET() {
  try {
    await ConnectDB();
    const leads = await BotLeadsModel.find({});
    return NextResponse.json({ leads }, { status: 200 });
  } catch (error) {
    console.error("GET leads error:", error);
    return NextResponse.json({ msg: "Error fetching leads." }, { status: 500 });
  }
}

// DELETE: Delete a lead by ID
export async function DELETE(request) {
  try {
    await ConnectDB();
    const id = request.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ msg: "ID is required." }, { status: 400 });
    }

    await BotLeadsModel.findByIdAndDelete(id);
    return NextResponse.json({ msg: "Lead deleted" }, { status: 200 });
  } catch (error) {
    console.error("DELETE lead error:", error);
    return NextResponse.json({ msg: "Error deleting lead." }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await ConnectDB();
    const id = request.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ msg: "ID is required." }, { status: 400 });
    }

    await BotLeadsModel.findByIdAndUpdate(id, { $set: { isComplete: true } });
    return NextResponse.json({ msg: "Lead updated" }, { status: 200 });
  } catch (error) {
    console.error("PUT lead error:", error);
    return NextResponse.json({ msg: "Error updating lead." }, { status: 500 });
  }
}
