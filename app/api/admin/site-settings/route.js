import { NextResponse } from 'next/server';
import { ConnectDB } from '@/lib/db/ConnectDB';
import SiteSettingsModel from '@/lib/models/SiteSetting';
import { deleteFileIfExists, saveImageToLocal } from '@/lib/functions';

export async function POST(req) {
    try {
        await ConnectDB();
        const contentType = req.headers.get("content-type") || "";
        let body = {};
        let uploadedImage = null;
        if (contentType.includes("multipart/form-data")) {
            const formData = await req.formData();
            body = {
                id: formData.get("id"),
                name: formData.get("name"),
                websiteName: formData.get("websiteName"),
                email: formData.get("email"),
                alternateEmail: formData.get("alternateEmail"),
                alternateMobile: formData.get("alternateMobile"),
                mobile: formData.get("mobile"),
                whatsAppNo: formData.get("whatsAppNo"),
                address: formData.get("address"),
                iframe: formData.get("iframe"),
                mapurl: formData.get("mapurl"),
                websiteDomain: formData.get("websiteDomain"),
                callbackurl: formData.get("callbackurl"),
                siteurl: formData.get("siteurl"),
                appsappleurl: formData.get("appsappleurl"),
                appsplaystoreurl: formData.get("appsplaystoreurl"),
                description: formData.get("description"),
            };

            const imageFile = formData.get("image");
            console.log("📌 Image Received:", imageFile);
            if (imageFile && imageFile.size > 0) {
                const uploadData = await saveImageToLocal("admin", imageFile);
                uploadedImage = {
                    url: uploadData.url,
                    public_id: uploadData.filename
                };
            }
        }

        else {
            body = await req.json();
            uploadedImage = body.image || null;
        }

        const existingData = await SiteSettingsModel.findOne({});
        let savedData;

        if (existingData) {
            if (uploadedImage && existingData.image?.public_id) {
                const deleted = deleteFileIfExists("admin", existingData.image.public_id);
                if (!deleted) console.warn("Old image not found or already deleted");
            }

            savedData = await SiteSettingsModel.findByIdAndUpdate(
                existingData._id,
                {
                    ...body,
                    image: uploadedImage || existingData.image,
                },
                { new: true }
            );
        } else {
            savedData = await SiteSettingsModel.create({
                ...body,
                image: uploadedImage,
            });
        }

        return NextResponse.json({ message: "Data uploaded successfully", data: savedData, }, { status: 201 });
    } catch (error) {
        console.error("Error in POST /site-settings:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        await ConnectDB();
        const data = await SiteSettingsModel.find({});
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error("Error fetching site settings:", error);
        return NextResponse.json({ error: "Failed to fetch site settings" }, { status: 500 });
    }
}
