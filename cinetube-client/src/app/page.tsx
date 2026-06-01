"use client";

import { useEffect, useState } from "react";
import LandingPage from "@/components/home/LandingPage";
import TrendingRow from "@/components/home/TrendingRow";

export default function Home() {
  const [mediaList, setMediaList] = useState([]);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/v1/media");
        if (res.ok) {
          const result = await res.json();
          setMediaList(result?.data || result || []);
        }
      } catch (error) {
        console.error("API Error:", error);
      }
    };
    fetchMedia();
  }, []);

  return (
    <main className="w-full min-h-screen bg-black flex flex-col scrollbar-none overflow-x-hidden">
      <div className="w-full block relative">
        <LandingPage />
      </div>

      {mediaList && mediaList.length > 0 && (
        <div className="w-full bg-black relative z-30 pb-20 -mt-16 md:-mt-28">
          <TrendingRow mediaList={mediaList} />
        </div>
      )}
    </main>
  );
}