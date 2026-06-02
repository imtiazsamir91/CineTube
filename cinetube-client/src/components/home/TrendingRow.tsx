"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MediaItem {
  id: string;
  title: string;
  synopsis: string;
  releaseYear: number;
  director: string | null;
  posterUrl: string;
  views: number;
  videoQuality?: string;
}

interface TrendingRowProps {
  mediaList: MediaItem[] | undefined | null;
}

export default function TrendingRow({ mediaList }: TrendingRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      rowRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  // ডেটা ফেচিং সেফটি চেক
  const safeMediaList = Array.isArray(mediaList) ? mediaList : [];

  const top10Trending = [...safeMediaList]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 10);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=600&auto=format&fit=crop";
  };

  if (top10Trending.length === 0) {
    return (
      <div className="w-full bg-black px-6 md:px-16 py-6 text-white text-center">
        <h2 className="text-xl font-bold mb-4">Trending Now 🔥</h2>
        <p className="text-zinc-500">No trending movies found at the moment.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-black px-6 md:px-16 py-6 text-white select-none block">
      <h2 className="text-xl font-bold tracking-wide md:text-2xl font-sans mb-4">Trending Now 🔥</h2>
      
      <div className="group relative w-full">
        <button
          onClick={() => handleScroll("left")}
          className="absolute bottom-0 left-0 top-0 z-40 m-auto h-20 w-10 items-center justify-center bg-black/60 opacity-0 transition hover:scale-110 hover:bg-black/90 group-hover:opacity-100 hidden md:flex rounded-r"
        >
          <ChevronLeft className="h-8 w-8" />
        </button>

        <div
          ref={rowRef}
          className="flex items-center gap-2 overflow-x-auto scrollbar-none pt-4 pb-12 w-full"
        >
          {top10Trending.map((media, index) => (
            <Link
              href={`/watch/${media.id}`}
              key={media.id}
              className="relative flex h-[200px] w-[180px] min-w-[180px] items-end justify-end md:h-[260px] md:w-[230px] md:min-w-[230px] mr-2 cursor-pointer transition-transform hover:scale-105"
            >
              <div 
                className="absolute bottom-[-20px] left-[-8px] z-10 text-[130px] font-black leading-none text-black select-none md:text-[200px]"
                style={{
                  WebkitTextStroke: "4px rgba(150, 150, 150, 0.5)",
                  fontFamily: "Impact, sans-serif",
                  letterSpacing: "-0.06em"
                }}
              >
                {index + 1}
              </div>

              <div className="relative z-20 h-[175px] w-[125px] overflow-hidden rounded-md md:h-[230px] md:w-[160px] shadow-[0_0_25px_rgba(0,0,0,0.9)] border border-zinc-900">
                <img
                  src={media.posterUrl}
                  alt={media.title}
                  onError={handleImageError}
                  className="h-full w-full object-cover"
                />
              </div>
            </Link>
          ))}
        </div>

        <button
          onClick={() => handleScroll("right")}
          className="absolute bottom-0 right-0 top-0 z-40 m-auto h-20 w-10 items-center justify-center bg-black/60 opacity-0 transition hover:scale-110 hover:bg-black/90 group-hover:opacity-100 hidden md:flex rounded-l"
        >
          <ChevronRight className="h-8 w-8" />
        </button>
      </div>
    </div>
  );
}