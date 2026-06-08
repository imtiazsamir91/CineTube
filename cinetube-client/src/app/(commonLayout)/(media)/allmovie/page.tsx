"use client";

import { useSearchParams } from "next/navigation"; 
import TrendingRow from "@/components/home/TrendingRow";
import AllMovies from "@/components/home/AllMovie";
import MyWatchlistRow from "@/components/home/MyWatchlistRow"; 
import { useQuery } from "@tanstack/react-query";
import { getMedias } from "@/service/mediaService";
import { useWatchlist } from "@/hooks/useWatchlist";

export default function AllMoviePage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || ""; 

  const { data: mediaList, isLoading, error } = useQuery({
    queryKey: ["all-movies-data", searchQuery], 
    queryFn: () => getMedias({ search: searchQuery }), 
    staleTime: 60000,
  });

  const { watchlist } = useWatchlist();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#B9090B] border-t-transparent" />
      </div>
    );
  }

  const movies = Array.isArray(mediaList) ? mediaList : [];
  
 
  const watchlistIds = watchlist?.map((item: any) => item.mediaId) || [];
  const myWatchlistMovies = movies.filter((movie) => watchlistIds.includes(movie.id));

  return (
    <main className="min-h-screen bg-black">
      <div className="pt-20 px-10">
        <h1 className="text-white text-3xl font-bold">Explore Movies</h1>
      </div>

      
      <MyWatchlistRow watchlist={myWatchlistMovies} />

     
      <TrendingRow mediaList={movies} />

     
      <div className="mt-8">
          <h2 className="text-white text-xl font-bold px-10 mb-4">All Movies 🎬</h2>
          <AllMovies mediaList={movies} />
      </div>
    </main>
  );
}