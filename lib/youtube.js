export async function fetchYouTubeVideos() {
    const API_KEY = process.env.YOUTUBE_API_KEY;
    const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;
    const MAX_RESULTS = 50;

    if (!API_KEY || !CHANNEL_ID) {
        console.error(
            "❌ Missing YouTube API key or channel ID in environment variables"
        );
        return [];
    }

    const url = `https://www.googleapis.com/youtube/v3/search?order=date&part=snippet&channelId=${CHANNEL_ID}&maxResults=${MAX_RESULTS}&key=${API_KEY}`;

    console.log("📡 Fetching from YouTube API...");

    try {
        const res = await fetch(url);
        const text = await res.text();

        if (!res.ok) {
            console.error("❌ YouTube API error:", res.status, text);
            return [];
        }

        const data = JSON.parse(text);
        if (!data.items || !Array.isArray(data.items)) {
            console.error("❌ Invalid YouTube API response format", data);
            return [];
        }

        const videos = data.items
            .filter((i) => i.id && i.id.kind === "youtube#video" && i.id.videoId)
            .map((i) => {
                const videoId = i.id.videoId;
                const title = i.snippet.title;
                const thumbnail =
                    i.snippet.thumbnails?.high?.url ||
                    `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
                const url = `https://www.youtube.com/watch?v=${videoId}`;
                const publishedAt = new Date(i.snippet.publishedAt);

                return { videoId, title, thumbnail, url, publishedAt };
            });

        return videos;
    } catch (error) {
        console.error("YouTube Fetch Error:", error);
        return [];
    }
}
