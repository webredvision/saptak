// app/api/risk-users/route.ts
import { ConnectDB } from "@/lib/db/ConnectDB";
import RiskUsersModel from "@/lib/models/RiskUsersModel";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await ConnectDB();

    const users = await RiskUsersModel.find({}).lean(); // lean() returns plain JS objects
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("GET /api/risk-users error:", error);
    return NextResponse.json({ msg: "Error fetching risk users." }, { status: 500 });
  }
}
