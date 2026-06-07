"use client";

import TrendingRow from "@/components/home/TrendingRow";
import AllMovies from "@/components/home/AllMovie";
import { useQuery } from "@tanstack/react-query";
import { getMedias } from "@/service/mediaService";

export default function AllMoviePage() {

  // queryKey পরিবর্তন করে একটি ইউনিক কী দেওয়া হয়েছে যাতে অন্য পেজের সাথে সংঘর্ষ না হয়
  const { data: mediaList, isLoading, error } = useQuery({
    queryKey: ["all-movies-data"], 
    queryFn: () => getMedias({}), 
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
    console.error("Fetch Error:", error);
    return (
      <div className="text-white text-center mt-20">
        Error loading data. Please try again.
      </div>
    );
  }

  // data এর টাইপ চেক করে নিশ্চিত করা হচ্ছে যে এটি একটি অ্যারে
  const movies = Array.isArray(mediaList) ? mediaList : [];

  return (
    <main className="min-h-screen bg-black">
      {movies.length > 0 ? (
        <>
          <TrendingRow mediaList={movies} />
          <AllMovies mediaList={movies} />
        </>
      ) : (
        <div className="text-white text-center pt-20">
          No movies found.
        </div>
      )}
    </main>
  );
}