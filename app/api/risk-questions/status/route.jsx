// app/api/risk-questions/status/route.ts
import { ConnectDB } from "@/lib/db/ConnectDB";
import RiskQuestionModel from "@/lib/models/RiskQuestionModel";
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    const { status } = await req.json();
    await ConnectDB();
    // Validate input
    if (typeof status !== "string") {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    // Update all risk questions
    const result = await RiskQuestionModel.updateMany({}, { status });

    return NextResponse.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (error) {
    console.error("Error updating risk question status:", error);
    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 }
    );
  }
}
