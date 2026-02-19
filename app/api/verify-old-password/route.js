import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/next-auth";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/db/ConnectDB";
import AdminModel from "@/lib/models/AdminModel";

export async function POST(req) {
  try {
    await ConnectDB();
    const { oldPassword } = await req.json();
    if (!oldPassword) {
      return NextResponse.json(
        { ok: false, error: "Old password is required" },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }


    const admin = await AdminModel.findById(session.user.id).lean();
    if (!admin) {
      return NextResponse.json(
        { ok: false, error: "Admin not found" },
        { status: 404 }
      );
    }

    const isValid = await bcrypt.compare(oldPassword, admin.password);
    return NextResponse.json({ ok: isValid });
  } catch (err) {
    console.error("Error verifying old password:", err);
    return NextResponse.json(
      { ok: false, error: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}
