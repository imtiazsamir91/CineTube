"use client";

import LandingPage from "@/components/home/LandingPage";
import TrendingRow from "@/components/home/TrendingRow";
import AllMovies from "@/components/home/AllMovie";
import MyWatchlistRow from "@/components/home/MyWatchlistRow";
import Link from "next/link";
import PricingPlans from "@/components/home/PricingPlans";
import { useQuery } from "@tanstack/react-query";
import { getMedias } from "@/service/mediaService";
import { useWatchlist } from "@/hooks/useWatchlist";

export default function Home() {
  const { data: mediaList, isLoading: loading } = useQuery({
    queryKey: ["media-list"],
    queryFn: () => getMedias(),
  });

  const { watchlist } = useWatchlist();
  const list = Array.isArray(mediaList) ? mediaList : [];

  // ✅ নতুন মুভি সবার আগে দেখানোর জন্য অ্যারেকে রিভার্স (Reverse) করে নেওয়া হলো
  const latestMovies = [...list].reverse();

  const watchlistIds = watchlist?.map((item: any) => item.mediaId || item.id) || [];
  // ওয়াচলিস্ট ফিল্টারিংও লেটেস্ট মুভির ক্রমানুযায়ী করা হলো
  const myWatchlistMovies = latestMovies.filter((movie) => watchlistIds.includes(movie.id));

  return (
    <main className="w-full min-h-screen bg-black flex flex-col overflow-x-hidden">
      <div className="w-full block relative">
        <LandingPage />
      </div>

      {loading ? (
        <div className="text-white text-center py-20">Loading movies...</div>
      ) : list.length > 0 ? (
        <div className="w-full bg-black relative z-30 pb-20 -mt-16 md:-mt-28">
          
          {/* ওয়াচলিস্ট রো */}
          <MyWatchlistRow watchlist={myWatchlistMovies} />
          
          {/* ট্রেন্ডিং রো (সব মুভি লেটেস্ট সিরিয়ালে) */}
          <TrendingRow mediaList={latestMovies} />
          
          {/* ✅ হোম পেজে শুধু মাত্র লেটেস্ট ১০টি মুভি দেখাবে */}
          <AllMovies mediaList={latestMovies.slice(0, 10)} />
          
          <div className="flex justify-center mt-10">
            <Link href="/allmovie" className="bg-zinc-800 hover:bg-[#B9090B] text-white px-8 py-3 rounded-full font-bold transition-all duration-300 hover:scale-110">
              See All Movies ✨
            </Link>
          </div>
        </div>
      ) : (
        <div className="text-white text-center py-20">No movies found.</div>
      )}
      
      <div><PricingPlans /></div>
    </main>
  );
}