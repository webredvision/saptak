
import { ConnectDB } from "@/lib/db/ConnectDB";
import FinancialHealthQuestionModel from "@/lib/models/FinancialHealthQuestionModel";
import { NextResponse } from "next/server";

export async function PUT(req) {

  try {
    await ConnectDB();

    const { status } = await req.json();

    if (typeof status !== "boolean") {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    await FinancialHealthQuestionModel.updateMany({}, { status });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating risk question status:", error);
    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 }
    );
  }
}
