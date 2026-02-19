"use client";

import { useEffect, useState } from "react";

export default function VideoGallery() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/videos")
      .then((res) => res.json())
      .then((data) => {
        setVideos(data.videos || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching videos:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--rv-secondary)]"></div>
      </div>
    );
  }

  if (!videos.length) {
    return (
      <div className="text-center py-10 text-[var(--rv-gray)]">
        No videos available yet. Please check back later.
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {videos.map((v) => (
          <a
            key={v._id || v.videoId}
            href={v.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
            style={{
              backgroundColor: "var(--rv-primary-light, #f3f4f6)",
            }}
          >
            {/* Thumbnail */}
            <div className="relative">
              <img
                src={v.thumbnail}
                alt={v.title}
                className="w-full h-56 object-cover"
              />

              {/* Gradient overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.4), transparent)",
                }}
              ></div>

              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-[var(--rv-bg-red-dark)] rounded-full p-4">
                  <svg
                    className="w-8 h-8 text-[var(--rv-white)]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>

              {/* Date tag */}
              <span
                className="absolute top-3 right-3    font-medium px-2.5 py-1 rounded-md backdrop-blur-sm"
                style={{
                  backgroundColor: "rgba(255,255,255,0.9)",
                  color: "#333",
                }}
              >
                {new Date(v.publishedAt).toLocaleDateString("en-GB")}
              </span>

              {/* Title overlay */}
              <div className="absolute bottom-0 left-0 w-full p-4 text-left">
                <h3 className="text-[var(--rv-white)] text-lg font-semibold leading-snug transition-colors line-clamp-2">
                  {v.title}
                </h3>
                <div
                  className="mt-2 h-1 w-12 rounded-full transition-all duration-300 group-hover:w-20"
                  style={{ backgroundColor: "var(--rv-secondary, #3b82f6)" }}
                ></div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
