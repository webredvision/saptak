"use client";
import { useTheme } from "@/app/ThemeProvider";
import GalleryTheme1 from "./gallery-theme1";
import GalleryTheme2 from "./gallery-theme2";
import GalleryTheme3 from "./gallery-theme3";
import GalleryTheme4 from "./gallery-theme4";
import GalleryTheme5 from "./gallery-theme5";

const galleryMap = {
  theme1: GalleryTheme1,
  theme2: GalleryTheme2,
  theme3: GalleryTheme3,
  theme4: GalleryTheme4,
  theme5: GalleryTheme5,
};

export default function GalleryClient({ images, videos }) {
  const { theme } = useTheme();
  const ThemedGallery = galleryMap[theme] || GalleryTheme1;
  return <ThemedGallery images={images} videos={videos} />;
}
