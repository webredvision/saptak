import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/db/ConnectDB";
import SiteSettingsModel from "@/lib/models/SiteSetting";

export async function GET() {
  try {
    await ConnectDB();
    const data = await SiteSettingsModel.findOne({}).select("image").lean();
    const logoUrl = data?.image?.url || null;
    return NextResponse.json({ logoUrl }, { status: 200 });
  } catch (error) {
    console.error("Error fetching site logo:", error?.message || error);
    return NextResponse.json({ logoUrl: null }, { status: 200 });
  }
}
