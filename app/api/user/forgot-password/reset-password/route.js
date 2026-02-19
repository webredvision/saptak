import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import axios from "axios";
import { ConnectDB } from "@/lib/db/ConnectDB";
import UserModel from "@/lib/models/UserModel";
import { getSiteData } from "@/lib/functions";
import { sendMail } from "@/lib/mail";
import { verifyResetJWT } from "@/lib/resetToken";

export async function POST(req) {
  try {
    const sitedata = await getSiteData();
    await ConnectDB();

    const { requestId, newPassword, confirmPassword } = await req.json();

    // 🔎 Validation
    if (!requestId || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 }
      );
    }

    // 🔐 Strong password validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{12,}$/;
    if (!passwordRegex.test(newPassword)) {
      return NextResponse.json(
        {
          error:
            "Password must be at least 12 characters long, contain 1 uppercase, 1 lowercase, 1 number, and 1 special character",
        },
        { status: 400 }
      );
    }

    // 🔍 Find user
    const user = await UserModel.findOne({
    resetPasswordRequestId: requestId,
    resetPasswordExpiry: { $gt: new Date() },
  });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired reset link" },
        { status: 404 }
      );
    }
 const payload = verifyResetJWT(user.resetPasswordToken);
if (payload.userId !== user._id.toString()) {
      return NextResponse.json(
        { error: "Unauthorized request" },
        { status: 401 }
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
    user.resetPasswordToken = undefined;
  user.resetPasswordExpiry = undefined;



await sendMail({
  to: user.email,
  subject: "Your Password Has Been Changed",
  html: `
    <p><strong>Your password has been successfully changed!</strong></p>

    <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%;">
      <tr><th>Field</th><th>Details</th></tr>
      <tr><td>Username</td><td>${user.username}</td></tr>
      <tr><td>Email</td><td>${user.email}</td></tr>
      <tr><td>Password</td><td><strong>${newPassword}</strong></td></tr>
    </table>

    <p>If you did not perform this action, contact support immediately.</p>
    <p><strong>${sitedata.websiteName} Team</strong></p>
  `,
});

        await user.save();
    return NextResponse.json(
      { success: true, message: "Password changed successfully. Email sent!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset Password Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
