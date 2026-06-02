"use client";

import { useEffect, useState } from "react";
import LandingPage from "@/components/home/LandingPage";
import TrendingRow from "@/components/home/TrendingRow";
import AllMovies from "@/components/home/AllMovie";
import Link from "next/link";
import PricingPlans from "@/components/home/PricingPlans";

export default function Home() {
  const [mediaList, setMediaList] = useState([]);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/v1/media");
        if (res.ok) {
          const result = await res.json();
          
         
          const movies = result?.data?.movies || [];
          
          console.log("Movies fetched in Home:", movies);
          setMediaList(movies);
        }
      } catch (error) {
        console.error("API Error:", error);
      }
    };
    fetchMedia();
  }, []);

  return (
    <main className="w-full min-h-screen bg-black flex flex-col overflow-x-hidden">
      <div className="w-full block relative">
        <LandingPage />
      </div>

      {/* mediaList চেক করুন */}
      {mediaList && mediaList.length > 0 ? (
        <div className="w-full bg-black relative z-30 pb-20 -mt-16 md:-mt-28">
          <TrendingRow mediaList={mediaList} />
          <AllMovies mediaList={mediaList.slice(0, 10)} />
          
          <div className="flex justify-center mt-10">
            <Link 
              href="/allmovie" 
              className="bg-zinc-800 hover:bg-[#B9090B] text-white px-8 py-3 rounded-full font-bold transition-all duration-300 hover:scale-110"
            >
              See All Movies ✨
            </Link>
          </div>
        </div>
      ) : (
        <div className="text-white text-center py-20">Loading movies...</div>
      )}
      
      <div><PricingPlans /></div>
    </main>
  );
}