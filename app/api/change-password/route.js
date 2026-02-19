
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/next-auth";
import { ConnectDB } from "@/lib/db/ConnectDB";
import bcrypt from "bcryptjs";
import UserModel from "@/lib/models/UserModel";
import axios from "axios";
import { getSiteData } from "@/lib/functions";
import { sendMail } from "@/lib/mail";

export async function POST(req) {
  try {
    const sitedata = await getSiteData();
    const { oldPassword, newPassword } = await req.json();

    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { ok: false, error: "Missing fields" },
        { status: 400 }
      );
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{12,}$/;
    if (!passwordRegex.test(newPassword)) {
      return NextResponse.json(
        {
          error:
            "Password must be at least 12 characters long, contain 1 uppercase, 1 lowercase, 1 number, and 1 special character",
        },
        { status: 400 },
      );
    }

    // ✅ Pass req to getServerSession in App Router
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await ConnectDB();

    const user = await UserModel.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }


    const ok = await bcrypt.compare(oldPassword, user.passwordHash || "");

    if (!ok) {
      return NextResponse.json(
        { ok: false, error: "Old password incorrect" },
        { status: 400 }
      );
    }

    // 🔑 Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 10);
    user.passwordHash = passwordHash;

    // Reset login/OTP attempts if any
    user.failedLoginAttempts = 0;
    user.blockUntil = null;
    user.otpHash = null;
    user.otpExpiry = null;
    user.failedOtpAttempts = 0;

    await user.save();



    await sendMail({
      to: user.email,
      subject: "Your Password Has Been Changed",
      html: `
        <p><strong>Your password has been successfully changed!</strong></p>

        <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%;">
          <tr><th>Field</th><th>Details</th></tr>
          <tr><td>Username</td><td>${user.username}</td></tr>
          <tr><td>Email</td><td>${user.email}</td></tr>
        </table>

        <p>If you did not perform this action, please contact support immediately.</p>
        <p><strong>${sitedata.websiteName} Team</strong></p>
      `,
    });

    return NextResponse.json(
      { success: true, message: "Password changed successfully. Email sent!" },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ change-password error:", err);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}
