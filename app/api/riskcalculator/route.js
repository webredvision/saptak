import { ConnectDB } from "@/lib/db/ConnectDB"
import RiskQuestionModel from "@/lib/models/RiskQuestionModel";
import RiskUsersModel from "@/lib/models/RiskUsersModel";
import { NextResponse } from "next/server";



export async function POST(request) {
    const data = await request.json();
    try {
        await ConnectDB();

        // Create user record
        const userRecord = await RiskUsersModel.create({
            username: data.user.username,
            mobile: data.user.mobile,
            email: data.user.email,
            message: data.user.message,
            score: data.score,
            riskprofile: data.riskprofile,
            result: data.answers.map((item) => ({
                question: item.question,
                answer: item.selectedAnswerText,
                mark: item.selectedAnswerMarks,
            })),
        });

        // Send email using unified transporter
        await sendEmail({
            to: process.env.SMTP_MAIL,
            subject: `New Risk Profile Assessment - ${data.user.username}`,
            html: emailTemplates.riskProfile(data),
        });

        // Send confirmation to user
        await sendEmail({
            to: data.user.email,
            subject: `Your Risk Profile Results: ${data.riskprofile}`,
            html: emailTemplates.riskProfile(data, true),
        });

        return NextResponse.json(
            { msg: "Created", id: userRecord._id },
            { status: 201 },
        );
    } catch (error) {
        console.error("Risk Profile POST error:", error);
        return NextResponse.json(
            { msg: "Error processing assessment." },
            {
                status: 500,
            },
        );
    }
}
export async function GET(request) {
    try {
        await ConnectDB();

        const questions = await RiskQuestionModel.find({}).lean(); // Use lean() for plain JS objects
        return NextResponse.json(questions, { status: 200 });
    } catch (error) {
        console.error("GET /api/risk-questions error:", error);
        return NextResponse.json({ msg: "Error fetching risk questions." }, { status: 500 });
    }
}
