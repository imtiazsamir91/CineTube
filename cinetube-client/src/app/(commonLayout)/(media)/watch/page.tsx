"use client";

import TrendingRow from "@/components/home/TrendingRow";
import { useQuery } from "@tanstack/react-query";


const fetchMedia = async () => {
  const res = await fetch("http://localhost:5000/api/v1/media");
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await res.json();
  return data?.data || data; 
};

export default function DashboardPage() {
  const { data: mediaList, isLoading, error } = useQuery({
    queryKey: ["media-list"],
    queryKeyHashFn: () => "media-list",
    queryFn: fetchMedia,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#B9090B] border-t-transparent" />
      </div>
    );
  }

  if (error) return null;

  return (
    <div className="min-h-screen bg-black">
      <TrendingRow mediaList={mediaList || []} />
    </div>
  );
}