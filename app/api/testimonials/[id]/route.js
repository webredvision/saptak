import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/db/ConnectDB";
import TestimonialModel from "@/lib/models/TestimonialModel";
import { deleteFileIfExists, saveImageToLocal } from "@/lib/functions";

export async function DELETE(req, { params }) {
  const { id } = await params;
  try {
    await ConnectDB();
    const testimonial = await TestimonialModel.findById(id);
    if (!testimonial) {
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 },
      );
    }
    const publicId = testimonial.image?.public_id;
    if (publicId) {
      const deleted = deleteFileIfExists("testimonials", publicId);
      if (!deleted) {
        console.warn("Image file not found or already deleted:", publicId);
      }
    }

    // Delete the testimonial from the database
    await TestimonialModel.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Testimonial deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    return NextResponse.json(
      { error: "Failed to delete testimonial" },
      { status: 500 }
    );
  }
}

// GET testimonial by ID
export async function GET(req, { params }) {
  const { id } = await params; // Extract ID from params

  try {
    await ConnectDB(); // Ensure DB connection
    const testimonial = await TestimonialModel.findById(id); // Properly await the findById function

    if (!testimonial) {
      return NextResponse.json(
        { error: "testimonial not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ testimonial }, { status: 200 });
  } catch (error) {
    console.error("Error fetching testimonial:", error);
    return NextResponse.json(
      { error: "Error while fetching testimonial" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  const { id } = await params;

  try {
    await ConnectDB();
    const formData = await req.formData();
    const image = formData.get("image");
    const file = formData.get('image');
    const author = formData.get("author");
    const designation = formData.get("designation");
    const content = formData.get("content");
    if (file && file.size > 500 * 1024) {
      return NextResponse.json(
        { error: "File size exceeds 500kb limit" },
        { status: 400 },
      );
    }
    const testimonial = await TestimonialModel.findById(id);
    if (!testimonial) {
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      );
    }
    // Check if an image is being uploaded
    if (image && image.size > 0) {
      // If there's a new image, handle the old image deletion
      const publicId = testimonial.image?.public_id;
      if (publicId) {
        const deleted = deleteFileIfExists("testimonials", publicId);
        if (!deleted) {
          console.warn("Image file not found or already deleted:", publicId);
        }
      }
      
      const uploadData = await saveImageToLocal('testimonials', file);if (uploadData.error) {
    return NextResponse.json(
      { error: uploadData.error },
      { status: uploadData.status || 400 }
    );
  }      // Update the testimonial with the new image data
      testimonial.image = {
        url: uploadData.url,
        public_id: uploadData.filename,
      };
    }

    // Update the testimonial fields only if new values are provided
    testimonial.author = author || testimonial.author;
    testimonial.content = content || testimonial.content;
    testimonial.designation = designation || testimonial.designation;

    // Save the updated testimonial
    await testimonial.save();

    return NextResponse.json(
      { message: "Testimonial updated successfully", testimonial },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating testimonial:", error);
    return NextResponse.json(
      { error: "Failed to update testimonial" },
      { status: 500 }
    );
  }
}
