import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/db/ConnectDB";
import { fetchYouTubeVideos } from "@/lib/youtube";
import Video from "@/lib/models/YouTubeVideo";

export async function GET() {
    try {
        await ConnectDB();
        console.log("✅ MongoDB connected");

        const videos = await fetchYouTubeVideos();
        console.log("🎬 Videos fetched:", videos.length);

        let added = 0;
        for (const v of videos) {
            if (!v.videoId || !v.url) {
                continue;
            }

            const exists = await Video.findOne({ videoId: v.videoId });
            if (!exists) {
                await Video.create(v);
                added++;
            } else {
                await Video.updateOne({ videoId: v.videoId }, v);
            }
        }

        return NextResponse.json({
            message: `✅ YouTube sync complete. Added ${added} new videos.`,
        });
    } catch (error) {
        console.error("❌ YouTube Sync Error:", error);
        return NextResponse.json(
            { error: "❌ Failed to sync YouTube videos" },
            { status: 500 }
        );
    }
}
