import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/db/ConnectDB";
import UserModel from "@/lib/models/UserModel";

const TOKEN_MAX_AGE = 30 * 60 * 1000; // 30 minutes in ms

export async function POST(req) {
  try {
    const { id, deviceId, tokenVersion } = await req.json();

    if (!id || !deviceId || tokenVersion === undefined) {
      return NextResponse.json(
        { valid: false, message: "Missing id, deviceId, or tokenVersion" },
        { status: 400 }
      );
    }

    await ConnectDB();

    const user = await UserModel.findById(id);
    if (!user) {
      return NextResponse.json({ valid: false, message: "User not found" }, { status: 404 });
    }

    const now = Date.now();
    let sessionChanged = false;

    // --- Clean up expired sessions ---
    for (const [dId, session] of user.sessionsversion.entries()) {
      const createdTime = new Date(session.createdAt).getTime();
      if (createdTime + TOKEN_MAX_AGE < now) {
        // Session expired → delete it
        user.sessionsversion.delete(dId);
        sessionChanged = true;
      }
    }

    if (sessionChanged) {
      await user.save();
    }

    // --- Check requested device ---
    const deviceData = user.sessionsversion.get(deviceId);
    if (!deviceData) {
      return NextResponse.json({ valid: false, message: "Device not found or expired" }, { status: 401 });
    }

    const { version, createdAt } = deviceData;

    // Check tokenVersion
    if (version !== tokenVersion) {
      return NextResponse.json({ valid: false, message: "Token invalidated (logged out)" }, { status: 401 });
    }

    return NextResponse.json({
      valid: true,
      user: {
        id: user._id.toString(),
        role: user.role,
        deviceId,
        tokenVersion,
      },
    });
  } catch (err) {
    console.error("Validate token error:", err);
    return NextResponse.json({ valid: false, message: "Server error" }, { status: 500 });
  }
}
