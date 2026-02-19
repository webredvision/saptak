import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/db/ConnectDB";
import { fetchYouTubeVideos } from "@/lib/youtube";
import YouTubeVideo from "@/lib/models/YouTubeVideo";

export async function GET(req) {
  const authHeader = req.headers.get("authorization") || "";
  const expected = process.env.CRON_SECRET || "";

  if (!expected || authHeader !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await ConnectDB();

    const videos = await fetchYouTubeVideos();
    let added = 0;

    for (const v of videos) {
      if (!v.videoId || !v.url) continue;
      const exists = await YouTubeVideo.findOne({ videoId: v.videoId });
      if (!exists) {
        await YouTubeVideo.create(v);
        added++;
      } else {
        await YouTubeVideo.updateOne({ videoId: v.videoId }, v);
      }
    }

    return NextResponse.json({
      message: `YouTube sync complete. Added ${added} new videos.`,
    });
  } catch (error) {
    console.error("YouTube cron sync error:", error);
    return NextResponse.json(
      { error: "Failed to sync YouTube videos" },
      { status: 500 },
    );
  }
}
