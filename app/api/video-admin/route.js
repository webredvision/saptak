import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/db/ConnectDB";
import VideoModel from "@/lib/models/VideoModel";
import { deleteFileIfExists, saveImageToLocal } from "@/lib/functions";

export async function POST(req) {
  let uploaded = null;
  try {
    await ConnectDB();

    const formData = await req.formData();
    const file = formData.get("image");
    const title = formData.get("title");
    const videoUrl = formData.get("videoUrl");
    const embedUrl = formData.get("embedUrl");
    const category = formData.get("category") || "manual";

    if (category === "manual" && file && file.size > 500 * 1024) {
      return NextResponse.json(
        { error: "File size exceeds 500kb limit" },
        { status: 400 },
      );
    }

    if (category === "manual" && file) {
      try {
        uploaded = await saveImageToLocal("video", file);
        if (uploaded.error) {
          return NextResponse.json(
            { error: uploaded.error },
            { status: uploaded.status || 400 }
          );
        }
      } catch (uploadError) {
        return NextResponse.json(
          { error: "Image upload failed" },
          { status: 500 }
        );
      }
    }

    await VideoModel.create({
      image: uploaded ? {
        url: uploaded.url,
        public_id: uploaded.filename,
      } : { url: "", public_id: "" },
      title,
      videoUrl: category === "manual" ? videoUrl : "",
      embedUrl: category === "iframe" ? embedUrl : "",
      category,
    });
    return NextResponse.json(
      { message: "Data Added successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    if (uploaded?.filename) {
      deleteFileIfExists("video", uploaded.filename);
    }

    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function GET(req, res) {
  try {
    await ConnectDB(); // Ensure DB connection
    const video = await VideoModel.find({}); // Fetch all videos
    return NextResponse.json(video, { status: 200 });
  } catch (error) {
    console.error("Error fetching video:", error);
    return NextResponse.json(
      { error: "Failed to fetch Video" },
      { status: 500 }
    );
  }
}
