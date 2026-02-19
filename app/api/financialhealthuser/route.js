import { ConnectDB } from "@/lib/db/ConnectDB";
import FinancialHealthUsersModel from "@/lib/models/FinancialHealthUsersModel";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await ConnectDB();

    // Use lean() to return plain JS objects instead of Mongoose documents (faster)
    const users = await FinancialHealthUsersModel.find({}).lean();

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error fetching financial health users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
