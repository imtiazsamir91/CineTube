"use client";

import AllMovies from "@/components/home/AllMovie";
import TrendingRow from "@/components/home/TrendingRow";
import { useQuery } from "@tanstack/react-query";
import { getMedias } from "@/service/mediaService"; 

export default function homePage() {
  
  const { data: mediaList, isLoading, error } = useQuery({
    queryKey: ["media-list"],
    queryFn: () => getMedias(), 
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#B9090B] border-t-transparent" />
      </div>
    );
  }

  if (error) return <div className="text-white text-center">Error loading media.</div>;

 
  const list = Array.isArray(mediaList) ? mediaList : [];

  return (
    <div className="min-h-screen bg-black">
      
      <TrendingRow mediaList={list} />
      
      
      
      
     
     
    </div>
  );
}