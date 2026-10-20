"use client";

import {
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { GripHorizontal, Play, X } from "lucide-react";

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
  const [isDismissed, setIsDismissed] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    offsetX: number;
    offsetY: number;
  } | null>(null);
  const youtubeId = useMemo(() => getYouTubeId(url), [url]);
  const directVideoUrl = !youtubeId && isSafeVideoUrl(url) ? url : null;

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

  const startDragging = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const player = playerRef.current;
    if (!player) return;
    const rect = player.getBoundingClientRect();
    dragRef.current = {
      pointerId: event.pointerId,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
    };
    setPosition({ x: rect.left, y: rect.top });
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const movePlayer = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    setPosition(keepOnScreen(event.clientX - drag.offsetX, event.clientY - drag.offsetY));
  };

  const stopDragging = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  useEffect(() => {
    const keepPlayerVisible = () => setPosition((current) => (
      current ? keepOnScreen(current.x, current.y) : current
    ));
    window.addEventListener("resize", keepPlayerVisible);
    return () => window.removeEventListener("resize", keepPlayerVisible);
  }, [keepOnScreen]);

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
      {!isDismissed && (
        <div
          ref={playerRef}
          style={position ? { left: position.x, top: position.y } : undefined}
          className={`fixed z-40 w-[150px] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl sm:w-[180px] ${
            position ? "" : "bottom-4 right-4"
          }`}
        >
          <div className="flex h-8 items-center justify-between border-b border-gray-200 bg-white px-1">
            <button
              type="button"
              onPointerDown={startDragging}
              onPointerMove={movePlayer}
              onPointerUp={stopDragging}
              onPointerCancel={stopDragging}
              aria-label="Move video player"
              title="Move video player"
              className="flex h-7 flex-1 touch-none cursor-grab items-center justify-center text-gray-500 active:cursor-grabbing"
            >
              <GripHorizontal className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setIsDismissed(true)}
              aria-label="Close video player"
              title="Close video player"
              className="flex h-7 w-7 items-center justify-center text-gray-600 hover:text-gray-950"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label={`Open video for ${productName}`}
            className="group relative block aspect-[9/16] w-full overflow-hidden bg-black"
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
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-900 shadow">
                <Play className="ml-0.5 h-5 w-5 fill-current" />
              </span>
            </span>
          </button>
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
