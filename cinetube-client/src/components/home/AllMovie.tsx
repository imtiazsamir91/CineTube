"use client";

import Link from "next/link";
import { Play, Film, Bookmark } from "lucide-react"; 
import { useWatchlist } from "@/hooks/useWatchlist"; 
import { toast } from "sonner"; // react-hot-toast এর পরিবর্তে sonner

export default function AllMovies({ mediaList }: { mediaList?: any[] }) {
  const list = Array.isArray(mediaList) ? mediaList : [];
  const { watchlist, addMutation, removeMutation } = useWatchlist();

  const isMovieInWatchlist = (id: string) => watchlist?.find((item: any) => item.mediaId === id);

  const handleToggleWatchlist = (movie: any) => {
    const inList = isMovieInWatchlist(movie.id);
    
    if (inList) {
      removeMutation.mutate(movie.id, {
        onSuccess: () => toast.success("Removed from Watchlist!"),
        onError: () => toast.error("Failed to remove item.")
      });
    } else {
      addMutation.mutate(movie.id, {
        onSuccess: () => toast.success("Added to Watchlist!"),
        onError: () => toast.error("Failed to add item.")
      });
    }
  };

  return (
    <div className="w-full px-6 md:px-12 py-10">
      <h2 className="text-xl font-bold text-white mb-6">All Movies 🎬</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {list.map((movie) => {
          const inList = isMovieInWatchlist(movie.id);
          
          return (
            <div key={movie.id} className="group relative block">
              <button
                onClick={() => handleToggleWatchlist(movie)}
                disabled={addMutation.isPending || removeMutation.isPending}
                className="absolute top-2 right-2 z-10 bg-black/50 p-2 rounded-full hover:bg-red-600 transition disabled:opacity-50"
              >
                <Bookmark className={`w-5 h-5 ${inList ? "fill-white text-white" : "text-white"}`} />
              </button>

              <Link href={`/watch/${movie.id}`} className="block transition-all duration-300 hover:-translate-y-2">
                <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-zinc-900 border border-zinc-800 shadow-xl">
                  <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 flex items-center justify-center">
                     <div className="bg-[#B9090B] p-3 rounded-full"><Play className="fill-white text-white w-5 h-5" /></div>
                  </div>
                </div>
                <div className="mt-3">
                  <h3 className="text-[14px] text-white font-semibold truncate flex items-center gap-1.5">
                    <Film className="w-3 h-3 text-[#B9090B]" /> {movie.title}
                  </h3>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}