import { NextResponse } from 'next/server';
import { ConnectDB } from '@/lib/db/ConnectDB';
import { deleteFileIfExists, saveImageToLocal } from '@/lib/functions';
import WebpopupsModel from "@/lib/models/PopupsModel";

export async function POST(req) {
  let uploaded = null;
  try {
    await ConnectDB();

    const formData = await req.formData();
    // const id = formData.get('id');
    const file = formData.get('image');
    const title = formData.get('title');
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (file && file.size > 500 * 1024) {
      return NextResponse.json(
        { error: "File size exceeds 500kb limit" },
        { status: 400 },
      );
    }
    if (file) {
      try {
        uploaded = await saveImageToLocal("webpopups", file);
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

    await WebpopupsModel.create({
      image: {
        url: uploaded.url,
        public_id: uploaded.filename,
      },
      title,
    });
    return NextResponse.json(
      { message: "Data Added successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.log(error);
    if (uploaded?.filename) {
      deleteFileIfExists("webpopups", uploaded.filename);
    }
    return NextResponse.json({ error: error }, { status: 500 });
  }

}

export async function GET(req, res) {
  try {
    await ConnectDB(); // Ensure DB connection
    const testimonial = await WebpopupsModel.find({}); // Fetch all webpopups
    return NextResponse.json(testimonial, { status: 200 });
  } catch (error) {
    console.error("Error fetching webpopups:", error);
    return NextResponse.json(
      { error: "Failed to fetch webpopups" },
      { status: 500 },
    );
  }
}
