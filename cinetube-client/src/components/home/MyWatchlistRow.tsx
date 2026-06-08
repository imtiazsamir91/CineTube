"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, X } from "lucide-react"; 
import { useWatchlist } from "@/hooks/useWatchlist"; 
import { toast } from "sonner"; 

interface WatchlistItem {
  mediaId?: string;
  id?: string;
  title: string;
  posterUrl: string;
}

interface MyWatchlistRowProps {
  watchlist: WatchlistItem[] | undefined | null;
}

export default function MyWatchlistRow({ watchlist }: MyWatchlistRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const { removeMutation } = useWatchlist(); 

  const handleRemove = (e: React.MouseEvent, id: string) => {
    e.preventDefault(); 
    removeMutation.mutate(id, {
      onSuccess: () => toast.success("Removed from Watchlist!"),
      onError: () => toast.error("Failed to remove."),
    });
  };

  const handleScroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      rowRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  const safeWatchlist = Array.isArray(watchlist) ? watchlist : [];
  if (safeWatchlist.length === 0) return null;

  return (
    <div className="w-full bg-black px-6 md:px-16 py-6 text-white select-none block">
      <h2 className="text-xl font-bold tracking-wide md:text-2xl font-sans mb-4">My Watchlist ❤️</h2>
      
      <div className="group relative w-full">
        <button onClick={() => handleScroll("left")} className="absolute bottom-0 left-0 top-0 z-40 m-auto h-20 w-10 items-center justify-center bg-black/60 opacity-0 transition hover:scale-110 hover:bg-black/90 group-hover:opacity-100 hidden md:flex rounded-r">
          <ChevronLeft className="h-8 w-8" />
        </button>

        <div ref={rowRef} className="flex items-center gap-4 overflow-x-auto scrollbar-none pt-4 pb-12 w-full">
          {safeWatchlist.map((media, index) => {
            const movieId = media.mediaId || media.id || "";
            return (
              <div key={`${movieId}-${index}`} className="relative flex h-[200px] w-[140px] min-w-[140px] md:h-[230px] md:w-[160px] md:min-w-[160px] transition-transform hover:scale-105">
                
                {/* রিমুভ বাটন */}
                <button 
                  onClick={(e) => handleRemove(e, movieId)}
                  className="absolute top-2 right-2 z-30 bg-black/70 p-1 rounded-full hover:bg-red-600 transition"
                >
                  <X className="w-4 h-4 text-white" />
                </button>

                <Link href={`/watch/${movieId}`} className="relative z-20 h-full w-full overflow-hidden rounded-md shadow-[0_0_25px_rgba(0,0,0,0.9)] border border-zinc-800">
                  <img src={media.posterUrl} alt={media.title} className="h-full w-full object-cover" />
                </Link>
              </div>
            );
          })}
        </div>

        <button onClick={() => handleScroll("right")} className="absolute bottom-0 right-0 top-0 z-40 m-auto h-20 w-10 items-center justify-center bg-black/60 opacity-0 transition hover:scale-110 hover:bg-black/90 group-hover:opacity-100 hidden md:flex rounded-l">
          <ChevronRight className="h-8 w-8" />
        </button>
      </div>
    </div>
  );
}