"use client";

import {
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { createPortal } from "react-dom";
import { GripHorizontal, Maximize2, Play, X } from "lucide-react";

interface ProductVideoProps {
  url: string;
  productName: string;
  initialSide?: "left" | "right";
}

interface EmbeddedMedia {
  embedUrl: string;
  aspectRatio: number;
}

interface YouTubeMedia {
  id: string;
  aspectRatio: number;
}

function getYouTubeMedia(value: string): YouTubeMedia | null {
  try {
    const url = new URL(value);
    if (url.hostname === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0];
      return id ? { id, aspectRatio: 16 / 9 } : null;
    }
    if (url.hostname.endsWith("youtube.com")) {
      if (url.pathname === "/watch") {
        const id = url.searchParams.get("v");
        return id ? { id, aspectRatio: 16 / 9 } : null;
      }
      const parts = url.pathname.split("/").filter(Boolean);
      if (["embed", "shorts", "live"].includes(parts[0]) && parts[1]) {
        return { id: parts[1], aspectRatio: parts[0] === "shorts" ? 9 / 16 : 16 / 9 };
      }
    }
  } catch {
    return null;
  }
  return null;
}

function getInstagramMedia(value: string): EmbeddedMedia | null {
  try {
    const url = new URL(value);
    if (url.hostname !== "instagram.com" && !url.hostname.endsWith(".instagram.com")) {
      return null;
    }
    const parts = url.pathname.split("/").filter(Boolean);
    if (!["reel", "reels", "p", "tv"].includes(parts[0]) || !parts[1]) return null;
    if (!/^[A-Za-z0-9_-]+$/.test(parts[1])) return null;
    return {
      embedUrl: `https://www.instagram.com/reel/${parts[1]}/embed/?autoplay=1&muted=1`,
      aspectRatio: 9 / 16,
    };
  } catch {
    return null;
  }
}

function isSafeVideoUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export default function ProductVideo({
  url,
  productName,
  initialSide = "right",
}: ProductVideoProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [directAspectRatio, setDirectAspectRatio] = useState(16 / 9);
  const playerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    offsetX: number;
    offsetY: number;
    startX: number;
    startY: number;
    moved: boolean;
    openOnTap: boolean;
  } | null>(null);
  const suppressOpenRef = useRef(false);
  const youtubeMedia = useMemo(() => getYouTubeMedia(url), [url]);
  const instagramMedia = useMemo(() => getInstagramMedia(url), [url]);
  const youtubeId = youtubeMedia?.id || null;
  const instagramEmbedUrl = instagramMedia?.embedUrl || null;
  const directVideoUrl = !youtubeMedia && !instagramMedia && isSafeVideoUrl(url) ? url : null;
  const previewAspectRatio = youtubeMedia?.aspectRatio
    ?? instagramMedia?.aspectRatio
    ?? directAspectRatio;
  const playerWidth = previewAspectRatio < 0.9
    ? "w-[150px] sm:w-[180px]"
    : previewAspectRatio <= 1.1
      ? "w-[180px] sm:w-[220px]"
      : "w-[240px] sm:w-[320px]";

  useEffect(() => setIsMounted(true), []);

  const keepOnScreen = useCallback((x: number, y: number) => {
    const player = playerRef.current;
    if (!player) return { x, y };
    const padding = 8;
    const maxX = Math.max(padding, window.innerWidth - player.offsetWidth - padding);
    const maxY = Math.max(padding, window.innerHeight - player.offsetHeight - padding);
    return {
      x: Math.min(Math.max(padding, x), maxX),
      y: Math.min(Math.max(padding, y), maxY),
    };
  }, []);

  const startDragging = (event: ReactPointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest("[data-no-drag]")) return;
    const player = playerRef.current;
    if (!player) return;
    const rect = player.getBoundingClientRect();
    dragRef.current = {
      pointerId: event.pointerId,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      startX: event.clientX,
      startY: event.clientY,
      moved: false,
      openOnTap: !(event.target as HTMLElement).closest("[data-drag-only]"),
    };
    setPosition({ x: rect.left, y: rect.top });
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const movePlayer = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) > 4) {
      drag.moved = true;
    }
    if (!drag.moved) return;
    setPosition(keepOnScreen(event.clientX - drag.offsetX, event.clientY - drag.offsetY));
  };

  const stopDragging = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (drag?.pointerId !== event.pointerId) return;
    suppressOpenRef.current = drag.moved;
    if (drag.moved) {
      window.setTimeout(() => {
        suppressOpenRef.current = false;
      }, 0);
    }
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    if (!drag.moved && drag.openOnTap) setIsOpen(true);
  };

  const openVideo = () => {
    if (suppressOpenRef.current) {
      suppressOpenRef.current = false;
      return;
    }
    setIsOpen(true);
  };

  useEffect(() => {
    const keepPlayerVisible = () => setPosition((current) => (
      current ? keepOnScreen(current.x, current.y) : current
    ));
    window.addEventListener("resize", keepPlayerVisible);
    return () => window.removeEventListener("resize", keepPlayerVisible);
  }, [keepOnScreen]);

  useEffect(() => {
    setPosition((current) => current ? keepOnScreen(current.x, current.y) : current);
  }, [directAspectRatio, keepOnScreen]);

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

  if (!isMounted || (!youtubeId && !instagramEmbedUrl && !directVideoUrl)) return null;

  const youtubePreview = youtubeId
    ? `https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&modestbranding=1&playsinline=1&rel=0`
    : "";
  const youtubeModal = youtubeId
    ? `https://www.youtube.com/embed/${youtubeId}?autoplay=1&loop=1&playlist=${youtubeId}&controls=1&modestbranding=1&playsinline=1&rel=0`
    : "";

  return createPortal(
    <>
      {!isDismissed && !isOpen && (
        <div
          ref={playerRef}
          onPointerDown={startDragging}
          onPointerMove={movePlayer}
          onPointerUp={stopDragging}
          onPointerCancel={stopDragging}
          style={position ? { left: position.x, top: position.y } : undefined}
          className={`fixed z-[80] max-w-[calc(100vw-1rem)] touch-none overflow-hidden rounded-xl border border-white/20 bg-black shadow-2xl ring-1 ring-black/10 ${playerWidth} ${
            position ? "" : initialSide === "left" ? "bottom-4 left-4" : "bottom-4 right-4"
          }`}
        >
          <div
            aria-hidden="true"
            data-drag-only
            className="absolute left-1/2 top-2 z-20 flex h-6 -translate-x-1/2 cursor-grab items-center rounded-full bg-black/55 px-2 text-white/90 backdrop-blur-sm active:cursor-grabbing"
          >
            <GripHorizontal className="h-4 w-4" />
          </div>
          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            data-no-drag
            aria-label="Close video player"
            title="Close video player"
            className="absolute right-2 top-2 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white shadow backdrop-blur-sm transition hover:bg-black/80"
          >
            <X className="h-4 w-4" />
          </button>
          <div
            role="button"
            tabIndex={0}
            onClick={openVideo}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") openVideo();
            }}
            aria-label={`Open video for ${productName}`}
            style={{ aspectRatio: previewAspectRatio }}
            className="group relative block w-full cursor-grab overflow-hidden bg-black active:cursor-grabbing"
          >
            {youtubeId ? (
              <iframe
                src={youtubePreview}
                title={`${productName} video preview`}
                allow="autoplay; encrypted-media; picture-in-picture"
                className="pointer-events-none h-full w-full border-0"
              />
            ) : instagramEmbedUrl ? (
              <iframe
                src={instagramEmbedUrl}
                title={`${productName} Instagram video preview`}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                className="pointer-events-none h-full w-full border-0 bg-white"
              />
            ) : (
              <video
                src={directVideoUrl || undefined}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                onLoadedMetadata={(event) => {
                  const video = event.currentTarget;
                  if (video.videoWidth && video.videoHeight) {
                    setDirectAspectRatio(video.videoWidth / video.videoHeight);
                  }
                }}
                className="h-full w-full object-contain"
              />
            )}
            {instagramMedia ? (
              <button
                type="button"
                data-no-drag
                onClick={(event) => {
                  event.stopPropagation();
                  setIsOpen(true);
                }}
                aria-label={`Open video for ${productName}`}
                className="absolute inset-0 z-10 flex items-center justify-center bg-black/0 transition hover:bg-black/15"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white shadow backdrop-blur-sm">
                  <Maximize2 className="h-5 w-5" />
                </span>
              </button>
            ) : (
              <span className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/20">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-900 shadow">
                  <Play className="ml-0.5 h-5 w-5 fill-current" />
                </span>
              </span>
            )}
          </div>
        </div>
      )}

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
                style={{ aspectRatio: youtubeMedia?.aspectRatio }}
                className="max-h-[80vh] w-full rounded-lg border-0 bg-black"
              />
            ) : instagramEmbedUrl ? (
              <iframe
                src={instagramEmbedUrl}
                title={`${productName} Instagram video`}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                style={{ aspectRatio: instagramMedia?.aspectRatio }}
                className="max-h-[80vh] w-full max-w-[430px] rounded-lg border-0 bg-white"
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
    </>,
    document.body,
  );
}
