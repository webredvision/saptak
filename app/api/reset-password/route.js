import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/db/ConnectDB";
import AdminModel from "@/lib/models/AdminModel";

export async function POST(req) {
  try {
    const { token, id, newPassword } = await req.json();

    if (!token || !id || !newPassword) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    await ConnectDB();

    const admin = await AdminModel.findOne({
      _id: id,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!admin) {
      return NextResponse.json(
        { ok: false, error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    admin.password = hashed;
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpires = undefined;

    await admin.save();

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error resetting password:", err);
    return NextResponse.json(
      { ok: false, error: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}
