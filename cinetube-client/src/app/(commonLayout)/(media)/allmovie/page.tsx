"use client";

import TrendingRow from "@/components/home/TrendingRow";
import AllMovies from "@/components/home/AllMovie";
import { useQuery } from "@tanstack/react-query";
import { getMedias } from "@/service/mediaService";

export default function AllMoviePage() {
  // queryKey তে একটি empty object পাস করা ভালো যদি ভবিষ্যতে ফিল্টারিং যোগ করেন
  const { data: mediaList = [], isLoading, error } = useQuery({
    queryKey: ["media-list"], 
    queryFn: () => getMedias({}), // এখানে একটি empty object বা প্রয়োজনীয় ফিল্টার পাস করুন
    staleTime: 60000, // ১ মিনিটের জন্য ডাটা ক্যাশ করবে, বারবার এপিআই কল হবে না
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#B9090B] border-t-transparent" />
      </div>
    );
  }

  // error অবজেক্টটি চেক করা ভালো
  if (error) {
    console.error("Fetch Error:", error);
    return <div className="text-white text-center mt-20">Error loading data. Please try again.</div>;
  }

  return (
    <main className="min-h-screen bg-black">
      {/* নিশ্চিত করুন mediaList খালি থাকলেও কম্পোনেন্টগুলো ক্র্যাশ করবে না */}
      {mediaList.length > 0 ? (
        <>
          <TrendingRow mediaList={mediaList} />
          <AllMovies mediaList={mediaList} />
        </>
      ) : (
        <div className="text-white text-center pt-20">No movies found.</div>
      )}
    </main>
  );
}