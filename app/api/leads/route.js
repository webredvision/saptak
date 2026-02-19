// app/api/leads/route.ts

import { ConnectDB } from "@/lib/db/ConnectDB";
import LeadsModel from "@/lib/models/LeadsModel";
import { NextResponse } from "next/server";

// CREATE a new lead
export async function POST(request) {
  try {
    const { username, mobile, email, message, address } = await request.json();

    // Validate required fields
    if (!username || !mobile || !email) {
      return NextResponse.json(
        { message: "Username, mobile, and email are required." },
        { status: 400 }
      );
    }

    await ConnectDB();

    // Save lead to database
    await LeadsModel.create({ username, mobile, email, message, address });

    return NextResponse.json({ msg: "Lead created successfully." }, { status: 201 });
  } catch (error) {
    console.error("POST /api/leads error:", error);
    return NextResponse.json({ msg: "Error saving lead." }, { status: 500 });
  }
}

// GET all leads
export async function GET(request) {
  try {
    await ConnectDB();

    const leads = await LeadsModel.find({});
    return NextResponse.json({ leads }, { status: 200 });
  } catch (error) {
    console.error("GET /api/leads error:", error);
    return NextResponse.json({ msg: "Error fetching leads." }, { status: 500 });
  }
}

// UPDATE lead status to complete
export async function PUT(request) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ msg: "Lead ID is required." }, { status: 400 });
    }

    await ConnectDB();
    await LeadsModel.findByIdAndUpdate(id, { $set: { isComplete: true } });

    return NextResponse.json({ msg: "Lead updated successfully." }, { status: 200 });
  } catch (error) {
    console.error("PUT /api/leads error:", error);
    return NextResponse.json({ msg: "Error updating lead." }, { status: 500 });
  }
}

// DELETE a lead
export async function DELETE(request) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ msg: "Lead ID is required." }, { status: 400 });
    }

    await ConnectDB();
    await LeadsModel.findByIdAndDelete(id);

    return NextResponse.json({ msg: "Lead deleted successfully." }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/leads error:", error);
    return NextResponse.json({ msg: "Error deleting lead." }, { status: 500 });
  }
}
