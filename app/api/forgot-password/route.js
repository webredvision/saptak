import crypto from "crypto";
import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/db/ConnectDB";
import AdminModel from "@/lib/models/AdminModel";
import SiteSettingsModel from "@/lib/models/SiteSetting";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { identifier } = await req.json(); // username or email

    if (!identifier) {
      return NextResponse.json(
        { ok: false, error: "Identifier is required" },
        { status: 400 }
      );
    }

    await ConnectDB();

    let admin = null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailRegex.test(identifier)) {
      admin = await AdminModel.findOne({ email: identifier }).lean();
    } else {
      admin = await AdminModel.findOne({ username: identifier }).lean();
    }

    // Do NOT reveal if admin exists (security best practice)
    if (!admin) {
      return NextResponse.json({ ok: true });
    }

    /* ---------------- TOKEN GENERATION ---------------- */

    const token = crypto.randomBytes(32).toString("hex");
    const expires = Date.now() + 1000 * 60 * 60; // 1 hour

    await AdminModel.updateOne(
      { _id: admin._id },
      {
        resetPasswordToken: token,
        resetPasswordExpires: new Date(expires),
      }
    );

    /* ---------------- SITE SETTINGS ---------------- */

    const site = await SiteSettingsModel.findOne().lean();
    const emailToSend = site?.email;

    if (!emailToSend) {
      return NextResponse.json(
        { ok: false, error: "No email configured" },
        { status: 500 }
      );
    }

    const resetUrl = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/reset-password?token=${token}&id=${admin._id}`;

    /* ---------------- MAIL SETUP ---------------- */

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NEXT_PUBLIC_SMTP_MAIL,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"${site?.websiteName || "Admin"}" <${process.env.SMTP_MAIL}>`,
      to: emailToSend,
      subject: "Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #f9f9f9; border-radius: 10px; border: 1px solid #eee;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: #2367f8; margin: 0;">
              ${site?.websiteName || "Admin"} Password Reset
            </h2>
          </div>

          <p style="font-size: 16px; color: #333;">
            Hello <strong>${admin.username}</strong>,
          </p>

          <p style="font-size: 16px; color: #333;">
            We received a request to reset your password. Click the button below to reset it.
            This link is valid for 1 hour.
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}"
              style="display: inline-block; text-decoration: none; background: #2367f8; color: white; padding: 12px 25px; border-radius: 8px; font-weight: bold;">
              Reset Password
            </a>
          </div>

          <p style="font-size: 14px; color: #555;">
            If the button doesn’t work, copy & paste this link into your browser:
          </p>

          <p style="word-break: break-all; background: #f0f0f0; padding: 10px; border-radius: 6px; font-size: 13px; color: #333;">
            ${resetUrl}
          </p>

          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />

          <p style="text-align: center; font-size: 14px; color: #777;">
            – ${site?.websiteName || "Admin"} Team
          </p>
        </div>
      `,
    };

    /* ---------------- SEND EMAIL ---------------- */

    try {
      await transporter.sendMail(mailOptions);
    } catch (err) {
      console.error("Email send failed:", err);
      return NextResponse.json(
        { ok: false, error: "Email send failed" },
        { status: 500 }
      );
    }

    /* ---------------- MASK EMAIL ---------------- */

    const maskEmail = (email) => {
      const [local, domain] = email.split("@");
      return `${local[0]}*****${local[local.length - 1]}@${domain}`;
    };

    return NextResponse.json({
      ok: true,
      maskedEmail: maskEmail(emailToSend),
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
