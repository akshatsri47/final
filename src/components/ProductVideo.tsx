"use client";

import { useEffect, useMemo, useState } from "react";
import { Play, X } from "lucide-react";

interface ProductVideoProps {
  url: string;
  productName: string;
}

function getYouTubeId(value: string): string | null {
  try {
    const url = new URL(value);
    if (url.hostname === "youtu.be") return url.pathname.split("/").filter(Boolean)[0] || null;
    if (url.hostname.endsWith("youtube.com")) {
      if (url.pathname === "/watch") return url.searchParams.get("v");
      const parts = url.pathname.split("/").filter(Boolean);
      if (["embed", "shorts", "live"].includes(parts[0])) return parts[1] || null;
    }
  } catch {
    return null;
  }
  return null;
}

function isSafeVideoUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export default function ProductVideo({ url, productName }: ProductVideoProps) {
  const [isOpen, setIsOpen] = useState(false);
  const youtubeId = useMemo(() => getYouTubeId(url), [url]);
  const directVideoUrl = !youtubeId && isSafeVideoUrl(url) ? url : null;

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  if (!youtubeId && !directVideoUrl) return null;

  const youtubePreview = youtubeId
    ? `https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&modestbranding=1&playsinline=1&rel=0`
    : "";
  const youtubeModal = youtubeId
    ? `https://www.youtube.com/embed/${youtubeId}?autoplay=1&loop=1&playlist=${youtubeId}&controls=1&modestbranding=1&playsinline=1&rel=0`
    : "";

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={`Open video for ${productName}`}
        className="group relative aspect-[9/16] w-full max-w-[220px] shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-black shadow-lg"
      >
        {youtubeId ? (
          <iframe
            src={youtubePreview}
            title={`${productName} video preview`}
            allow="autoplay; encrypted-media; picture-in-picture"
            className="pointer-events-none h-full w-full border-0"
          />
        ) : (
          <video
            src={directVideoUrl || undefined}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="h-full w-full object-cover"
          />
        )}
        <span className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/20">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-gray-900 shadow">
            <Play className="ml-0.5 h-5 w-5 fill-current" />
          </span>
        </span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${productName} video`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsOpen(false);
          }}
        >
          <div className="relative flex max-h-[90vh] w-full max-w-4xl items-center justify-center">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close video"
              className="absolute -top-12 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-900 shadow"
            >
              <X className="h-6 w-6" />
            </button>
            {youtubeId ? (
              <iframe
                src={youtubeModal}
                title={`${productName} video`}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                className="aspect-video max-h-[80vh] w-full rounded-lg border-0 bg-black"
              />
            ) : (
              <video
                src={directVideoUrl || undefined}
                autoPlay
                loop
                controls
                playsInline
                className="max-h-[80vh] max-w-full rounded-lg bg-black"
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
