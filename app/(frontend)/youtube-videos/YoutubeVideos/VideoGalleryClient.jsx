"use client";
import { useTheme } from "@/app/ThemeProvider";
import YoutubeTheme1 from "./youtube-theme1";
import YoutubeTheme2 from "./youtube-theme2";
import YoutubeTheme3 from "./youtube-theme3";
import YoutubeTheme4 from "./youtube-theme4";
import YoutubeTheme5 from "./youtube-theme5";

const videoGalleryMap = {
    theme1: YoutubeTheme1,
    theme2: YoutubeTheme2,
    theme3: YoutubeTheme3,
    theme4: YoutubeTheme4,
    theme5: YoutubeTheme5,
};

export default function VideoGalleryClient({
  videoData = [],
  hideTabs = false,
  hideCategories = false,
}) {
  const { theme } = useTheme();
  const ThemedVideoGallery = videoGalleryMap[theme] || YoutubeTheme1;

  return (
    <ThemedVideoGallery
      videoData={videoData}
      hideTabs={hideTabs}
      hideCategories={hideCategories}
    />
  );
}
