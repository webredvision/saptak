import { NextResponse } from "next/server";
import axios from "axios";
import RiskQuestionModel from "@/lib/models/RiskQuestionModel";
import RoboModel from "@/lib/models/RoboModel";
import { ConnectDB } from "@/lib/db/ConnectDB";

export async function GET(request) {
  try {
    await ConnectDB();

    // 1️⃣ Check for robo permissions
    const roboPermission = await RoboModel.findOne({
      softwareUser: true,
      $or: [{ roboUser: true }, { roboUser: false }],
    })
      .sort({ createdAt: -1 })
      .lean();

    if (roboPermission) {
      const roboResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_DATA_API}/api/open-apis/risk-question?apikey=${process.env.NEXT_PUBLIC_API_KEY}`
      );
      const roboData = roboResponse.data;
      return NextResponse.json(roboData, { status: 200 });
    }

    // 2️⃣ Fetch existing questions from DB
    let questions = await RiskQuestionModel.find({}).lean();

    const hasActiveStatus = questions.some((q) => q.status === true);

    // Return immediately if active questions exist
    if (hasActiveStatus) {
      return NextResponse.json(questions, { status: 200 });
    }

    // Delete old inactive questions (status: false)
    if (questions.length > 0) {
      await RiskQuestionModel.deleteMany({ status: false });
      console.log("🧹 Old inactive questions deleted.");
    }

    // 3️⃣ Fetch fresh questions from external API
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_DATA_API}/api/open-apis/risk-questions?apikey=${process.env.NEXT_PUBLIC_API_KEY}`
    );
    const fetchedQuestions = response.data;

    // 4️⃣ Transform marks
    const transformedQuestions = fetchedQuestions.map((q) => {
      const transformedAnswers = q.answers.map((a) => {
        let newMarks = a.marks;
        if (a.marks === 1) newMarks = 2;
        else if (a.marks === 2) newMarks = 4;
        else if (a.marks === 3) newMarks = 6;
        else if (a.marks === 4) newMarks = 8;
        else if (a.marks === 5) newMarks = 10;

        return { ...a, marks: newMarks };
      });

      return {
        question: q.question,
        answers: transformedAnswers,
        status: false, // default inactive
      };
    });
    const currentQuestions = await RiskQuestionModel.find({}).lean();
    for (const tq of transformedQuestions) {
      const existing = currentQuestions.find((q) => q.question === tq.question);
      if (existing) {
        const answersChanged =
          JSON.stringify(existing.answers) !== JSON.stringify(tq.answers);
        if (answersChanged) {
          await RiskQuestionModel.findByIdAndUpdate(existing._id, {
            answers: tq.answers,
            status: tq.status,
          });
        }
      } else {
        await RiskQuestionModel.create(tq);
      }
    }
    return NextResponse.json(transformedQuestions, { status: 200 });
  } catch (error) {
    console.error("Error fetching risk questions:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {


  try {
    await ConnectDB();

    const { question, answers } = await req.json();
    if (!question || !Array.isArray(answers)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    const updated = await RiskQuestionModel.findByIdAndUpdate(
      params.id,
      { question, answers },
      { new: true }
    );
    if (!updated) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: "Failed to update question" },
      { status: 500 }
    );
  }
}
