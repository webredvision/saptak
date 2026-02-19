import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/db/ConnectDB";
import UserModel from "@/lib/models/UserModel";
import { getSiteData } from "@/lib/functions";
import { sendMail } from "@/lib/mail";
import { createResetJWT } from "@/lib/resetToken";

// Helper: generate 16-character alphanumeric token
function generateToken(length = 16) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

export async function POST(req) {
  try {
    const sitedata = await getSiteData();
    await ConnectDB();

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email or username required" }, { status: 400 });
    }

    const user = await UserModel.findOne({
      $or: [{ email: email }, { username: email }],
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    // 🔑 Generate 16-character token
    const requestId = "REQ_" + generateToken(16);
    const resetJWT = createResetJWT({
      userId: user._id.toString(),
      email: user.email,
    });
    // const customToken = generateToken(16);
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Save token & expiry in DB
    user.resetPasswordRequestId = requestId;
    user.resetPasswordToken = resetJWT;
    user.resetPasswordExpiry = expiry;
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password/${requestId}`;

    await sendMail({
      to: user.email,
      subject: "Reset your password",
      html: `
        <p><strong>For Changing Your Password!</strong></p>

        <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%;">
          <tr><th>Field</th><th>Details</th></tr>
          <tr><td>Username</td><td>${user.username}</td></tr>
          <tr><td>Email</td><td>${user.email}</td></tr>
          <tr>
            <td>Link</td>
            <td>
              <a href="${resetUrl}">Click here to reset your password</a>
              <br/>This link expires in 15 minutes.
            </td>
          </tr>
        </table>

        <p>If you did not request this, contact support immediately.</p>
        <p><strong>${sitedata.websiteName} Team</strong></p>
      `,
    });

    await user.save();
    return NextResponse.json({ success: true, message: "Reset link sent to your email!" }, { status: 200 });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
