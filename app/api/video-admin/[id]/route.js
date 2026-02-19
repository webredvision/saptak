import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import VideoModel from '@/lib/models/VideoModel';
import { deleteFileIfExists, saveImageToLocal } from '@/lib/functions';
import { ConnectDB } from '@/lib/db/ConnectDB';

export async function DELETE(req, { params }) {
  const { id } = await params;

  try {
    await ConnectDB();

    // Find the testimonial by ID
    const video = await VideoModel.findById(id);

    if (!video) {
      return NextResponse.json({ error: 'video not found' }, { status: 404 });
    }

    const publicId = video.image.public_id;
    if (publicId) {
      const deleted = deleteFileIfExists("video", publicId);
      if (!deleted) {
        console.warn("Image file not found or already deleted:", publicId);
      }
    }
    await VideoModel.findByIdAndDelete(id);
    return NextResponse.json({ message: 'video deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting video:', error);
    return NextResponse.json({ error: 'Failed to delete video' }, { status: 500 });
  }
}

// GET testimonial by ID
export async function GET(req, { params }) {
  const { id } = await params; // Extract ID from params

  try {
    await ConnectDB(); // Ensure DB connection
    const video = await VideoModel.findById(id); // Properly await the findById function

    if (!video) {
      return NextResponse.json({ error: 'video not found' }, { status: 404 });
    }

    return NextResponse.json({ video }, { status: 200 });
  } catch (error) {
    console.error('Error fetching video:', error);
    return NextResponse.json({ error: 'Error while fetching video' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const uploadDirectory = path.join(process.cwd(), "public/images");
  if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
  }

  const { id } = await params;

  try {
    await ConnectDB();

    const formData = await req.formData();
    const file = formData.get("image");
    const title = formData.get("title");
    const videoUrl = formData.get("videoUrl");
    const embedUrl = formData.get("embedUrl");
    const category = formData.get("category");

    // Find existing video
    const video = await VideoModel.findById(id);
    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    if (category) video.category = category;
    if (title) video.title = title;

    if (video.category === "iframe") {
      if (embedUrl) video.embedUrl = embedUrl;
      video.videoUrl = "";
      // Optional: Clear image if switching to iframe, though keeping it as fallback thumbnail might be okay.
      // Considering the user request "only title and iframe url should add", I'll clear it.
      if (video.image?.public_id && !file) {
        deleteFileIfExists("video", video.image.public_id);
        video.image = { url: "", public_id: "" };
      }
    } else {
      if (videoUrl) video.videoUrl = videoUrl;
      video.embedUrl = "";

      if (file && file.size > 0) {
        // Validate file size
        if (file.size > 500 * 1024) {
          return NextResponse.json(
            { error: "File size exceeds 500 KB limit" },
            { status: 400 }
          );
        }

        // Delete old image if exists
        const publicId = video.image?.public_id;
        if (publicId) {
          deleteFileIfExists("video", publicId);
        }

        // Upload new image
        const uploadData = await saveImageToLocal("video", file);
        if (uploadData.error) {
          return NextResponse.json(
            { error: uploadData.error },
            { status: uploadData.status || 400 }
          );
        }
        video.image = {
          url: uploadData.url,
          public_id: uploadData.filename,
        };
      }
    }

    await video.save();

    return NextResponse.json(
      { message: "✅ Video updated successfully", video },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating video:", error);
    return NextResponse.json(
      { error: "Failed to update video" },
      { status: 500 }
    );
  }
}