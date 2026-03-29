"use client";

import React from "react";

interface VideoEmbedProps {
  url: string;
  title?: string;
  aspectRatio?: "16:9" | "4:3" | "1:1";
}

/**
 * VideoEmbed - Responsive video embed (YouTube, Vimeo)
 *
 * @example
 * <VideoEmbed url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" title="Video Title" />
 */
export default function VideoEmbed({
  url,
  title = "Video",
  aspectRatio = "16:9",
}: VideoEmbedProps) {
  const getEmbedUrl = (url: string) => {
    // YouTube
    const youtubeMatch = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/
    );
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }

    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }

    return url;
  };

  const aspectRatioClasses: Record<string, string> = {
    "16:9": "aspect-video",
    "4:3": "aspect-[4/3]",
    "1:1": "aspect-square",
  };

  return (
    <div className="my-8">
      <div
        className={`w-full ${aspectRatioClasses[aspectRatio]} rounded-lg overflow-hidden`}
      >
        <iframe
          src={getEmbedUrl(url)}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    </div>
  );
}
