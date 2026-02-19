import { NextResponse } from "next/server";
import SettingMOdel from "@/lib/models/settings";
import { ConnectDB } from "@/lib/db/ConnectDB";


export async function GET() {
  await ConnectDB();
  const doc = await SettingMOdel.findOne({ key: "theme" }).lean();
  return NextResponse.json({ base_theme: doc?.value?.base_theme || "theme1" });
}

export async function POST(req) {
  try {
    const { base_theme } = await req.json();
    if (!base_theme) {
      return NextResponse.json({ success: false, message: "No theme provided" }, { status: 400 });
    }

    await ConnectDB();
    const doc = await SettingMOdel.findOneAndUpdate(
      { key: "theme" },
      { value: { base_theme } },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, base_theme: doc.value.base_theme });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
