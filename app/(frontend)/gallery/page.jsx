export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

import GalleryClient from "./Gallery/GalleryClient";

export default async function Page() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_NEXTAUTH_URL || 'http://localhost:3000'}/api/gallery`,
    {
      cache: "no-store",
    }
  );

  const data = res.ok ? await res.json() : { images: [], videos: [] };

  return (
    <GalleryClient
      images={data.images || []}
      videos={data.videos || []}
    />
  );
}
