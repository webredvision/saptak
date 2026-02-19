import { ConnectDB } from "@/lib/db/ConnectDB";
import YouTubeVideo from "@/lib/models/YouTubeVideo";
import VideoModel from "@/lib/models/VideoModel";
import { NextResponse } from "next/server";

export async function GET() {
    await ConnectDB();
    const [ytVideos, manualVideos] = await Promise.all([
        YouTubeVideo.find().sort({ publishedAt: -1 }),
        VideoModel.find().sort({ createdAt: -1 }),
    ]);

    const normalizedYouTube = ytVideos.map((v) => ({
        _id: v._id,
        source: "youtube",
        title: v.title,
        url: v.url,
        embedUrl: "",
        thumbnail: v.thumbnail,
        image: { url: v.thumbnail },
        publishedAt: v.publishedAt,
        category: "YouTube",
    }));

    const normalizedManual = manualVideos.map((v) => ({
        _id: v._id,
        source: "manual",
        title: v.title,
        url: v.videoUrl || v.embedUrl || "",
        embedUrl: v.embedUrl || "",
        thumbnail: v.image?.url || "/no-image.jpg",
        image: v.image || null,
        publishedAt: v.createdAt,
        category: v.category || "Manual",
    }));

    const videos = [...normalizedYouTube, ...normalizedManual].sort((a, b) => {
        const aDate = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        const bDate = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
        return bDate - aDate;
    });

    return NextResponse.json({ videos });
}
