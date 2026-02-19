import { ConnectDB } from "@/lib/db/ConnectDB";
import Feedback from "@/lib/models/Feedback";
import { NextResponse } from "next/server";
import { sendAdminEmail, emailTemplates } from "@/lib/email/transporter";

export async function POST(req) {
    try {
        await ConnectDB();

        const data = await req.json();
        const ip =
            req.headers.get("x-forwarded-for")?.split(",")[0] ||
            req.headers.get("x-real-ip") ||
            "unknown";

        // Check if feedback from this IP already exists
        const existing = await Feedback.findOne({ userIP: ip });
        if (existing) {
            return NextResponse.json(
                { message: "Feedback already submitted" },
                { status: 400 }
            );
        }

        const feedback = new Feedback({ ...data, userIP: ip });
        await feedback.save();

        // Send email notification to admin
        try {
            await sendAdminEmail(
                "New Feedback Received",
                emailTemplates.feedback(data)
            );
        } catch (emailError) {
            console.error("Failed to send email notification:", emailError);
            // Don't fail the request if email fails
        }

        return NextResponse.json({ message: "Feedback submitted successfully" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function GET() {
    try {
        await ConnectDB();
        const feedbacks = await Feedback.find().sort({ createdAt: -1 });
        return NextResponse.json(feedbacks);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }
}
