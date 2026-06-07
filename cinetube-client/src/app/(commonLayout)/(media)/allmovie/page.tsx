"use client";

import { useSearchParams } from "next/navigation"; 
import TrendingRow from "@/components/home/TrendingRow";
import AllMovies from "@/components/home/AllMovie";
import { useQuery } from "@tanstack/react-query";
import { getMedias } from "@/service/mediaService";

export default function AllMoviePage() {

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || ""; 

  
  const { data: mediaList, isLoading, error } = useQuery({
    queryKey: ["all-movies-data", searchQuery], 
    queryFn: () => getMedias({ search: searchQuery }), 
    staleTime: 60000,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#B9090B] border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-white text-center mt-20">
        Error loading data. Please try again.
      </div>
    );
  }

  const movies = Array.isArray(mediaList) ? mediaList : [];

  return (
    <main className="min-h-screen bg-black">
    
      <div className="pt-20 px-10">
        <h1 className="text-white text-2xl font-bold">
          {searchQuery ? `Search Results for: "${searchQuery}"` : "All Movies"}
        </h1>
      </div>

      {movies.length > 0 ? (
        <>
          <TrendingRow mediaList={movies} />
          <AllMovies mediaList={movies} />
        </>
      ) : (
        <div className="text-white text-center pt-10">
          No movies found {searchQuery && `for "${searchQuery}"`}
        </div>
      )}
    </main>
  );
}