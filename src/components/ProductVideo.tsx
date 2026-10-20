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
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    offsetX: number;
    offsetY: number;
    startX: number;
    startY: number;
    moved: boolean;
  } | null>(null);
  const suppressOpenRef = useRef(false);
  const youtubeId = useMemo(() => getYouTubeId(url), [url]);
  const directVideoUrl = !youtubeId && isSafeVideoUrl(url) ? url : null;

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

  if (!isMounted || (!youtubeId && !directVideoUrl)) return null;

  const youtubePreview = youtubeId
    ? `https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&modestbranding=1&playsinline=1&rel=0`
    : "";
  const youtubeModal = youtubeId
    ? `https://www.youtube.com/embed/${youtubeId}?autoplay=1&loop=1&playlist=${youtubeId}&controls=1&modestbranding=1&playsinline=1&rel=0`
    : "";

  return createPortal(
    <>
      {!isDismissed && (
        <div
          ref={playerRef}
          onPointerDown={startDragging}
          onPointerMove={movePlayer}
          onPointerUp={stopDragging}
          onPointerCancel={stopDragging}
          style={position ? { left: position.x, top: position.y } : undefined}
          className={`fixed z-[80] w-[150px] touch-none overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl sm:w-[180px] ${
            position ? "" : "bottom-4 right-4"
          }`}
        >
          <div className="flex h-8 items-center justify-between border-b border-gray-200 bg-white px-1">
            <div
              aria-hidden="true"
              className="flex h-7 flex-1 cursor-grab items-center justify-center text-gray-500 active:cursor-grabbing"
            >
              <GripHorizontal className="h-5 w-5" />
            </div>
            <button
              type="button"
              onClick={() => setIsDismissed(true)}
              data-no-drag
              aria-label="Close video player"
              title="Close video player"
              className="flex h-7 w-7 items-center justify-center text-gray-600 hover:text-gray-950"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <button
            type="button"
            onClick={openVideo}
            aria-label={`Open video for ${productName}`}
            className="group relative block aspect-[9/16] w-full cursor-grab overflow-hidden bg-black active:cursor-grabbing"
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
    </>,
    document.body,
  );
}
