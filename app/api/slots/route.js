// src/app/api/slots/route.js
import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/db/ConnectDB";
import Slot from "@/lib/models/Slot";
import { buildSlots } from "@/lib/BookMeeting/server/slots";

export async function GET(req) {
    const date =
        req.nextUrl.searchParams.get("date") ||
        new Date().toISOString().slice(0, 10);

    try {
        await ConnectDB();
        const booked = await Slot.find({ date });
        const slots = buildSlots(booked || []);
        return NextResponse.json({ slots });
    } catch (error) {
        console.error("Failed to load slots:", error?.message || error);
        const slots = buildSlots([]);
        return NextResponse.json(
            { slots, error: "Slots unavailable. Please try again later." },
            { status: 200 },
        );
    }
}
