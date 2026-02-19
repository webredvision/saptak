import { NextResponse } from 'next/server';
import { ConnectDB } from '@/lib/db/ConnectDB';
import TestimonialModel from '@/lib/models/TestimonialModel';
import { saveImageToLocal } from '@/lib/functions';

export async function POST(req) {

  let uploaded = null;
  try {
    await ConnectDB();

    const formData = await req.formData();
    const file = formData.get('image');
    const author = formData.get('author');
    const designation = formData.get('designation');
    const content = formData.get('content');

    if (!file || !author || !designation || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (file && file.size > 500 * 1024) {
      return NextResponse.json(
        { error: "File size exceeds 500kb limit" },
        { status: 400 },
      );
    }
    if (file) {
      try {
        uploaded = await saveImageToLocal("testimonials", file);
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
    // await fs.unlink(tempFilePath);

    await TestimonialModel.create({
      image: {
        url: uploaded.url,
        public_id: uploaded.filename,
      },
      author,
      designation,
      content,
    });

    return NextResponse.json({ message: 'Testimonial added successfully' }, { status: 201 });
  } catch (error) {
    console.error('Upload Error:', error);
    if (uploaded?.filename) {
      deleteFileIfExists("testimonials", uploaded.filename);
    }

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req, res) {
  try {
    await ConnectDB();

    const testimonial = await TestimonialModel.find({}).sort({ createdAt: -1 });; // Fetch all testimonials
    return NextResponse.json(testimonial, { status: 200 });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
  }
}
