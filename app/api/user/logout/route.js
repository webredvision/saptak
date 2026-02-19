import { getToken } from "next-auth/jwt";
import { ConnectDB } from "@/lib/db/ConnectDB";
import UserModel from "@/lib/models/UserModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
     if (token?.id && token.deviceId) {
      await ConnectDB();

      // Remove the current device from sessionsversion
      const user = await UserModel.findById(token.id);
      if (user.sessionsversion.has(token.deviceId)) {
        user.sessionsversion.delete(token.deviceId);
        await user.save();
      }
    }

     const response = NextResponse.json({ success: true });

   

  return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
