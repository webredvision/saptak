import VideoGalleryClient from "./YoutubeVideos/VideoGalleryClient";

export default async function Page() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/videos`,
    {
      cache: "no-store",
    },
  );

  const data = res.ok ? await res.json() : {};
  const videos = Array.isArray(data?.videos) ? data.videos : [];
  const youtubeOnly = videos.filter((v) => v.source === "youtube");

  return <VideoGalleryClient videoData={youtubeOnly} hideTabs hideCategories />;
}
