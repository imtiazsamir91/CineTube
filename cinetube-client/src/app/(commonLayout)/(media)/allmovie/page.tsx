"use client";

import TrendingRow from "@/components/home/TrendingRow";
import AllMovies from "@/components/home/AllMovie";
import { useQuery } from "@tanstack/react-query";

// ১. এই ফাংশনটি DashboardPage এর উপরে রাখুন অথবা আলাদা ফাইলে রেখে ইমপোর্ট করুন
const fetchMedia = async () => {
  const res = await fetch("http://localhost:5000/api/v1/media");
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  const result = await res.json();
  // আপনার এপিআই রেসপন্স অনুযায়ী ডেটা রিটার্ন করা হচ্ছে
  return result?.data || []; 
};

export default function DashboardPage() {
  // ২. টাইপস্ক্রিপ্টের জন্য `initialData` বা টাইপ ডিফাইন করা ভালো
  const { data: mediaList = [], isLoading, error } = useQuery({
    queryKey: ["media-list"],
    queryFn: fetchMedia, // এখানে সরাসরি ফাংশনটি পাস করুন
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#B9090B] border-t-transparent" />
      </div>
    );
  }

  if (error) return <div className="text-white text-center mt-20">Error loading data.</div>;

  return (
    <main className="min-h-screen bg-black">
      {/* ৩. mediaList নিশ্চিতভাবে অ্যারো হিসেবে যাচ্ছে */}
      <TrendingRow mediaList={mediaList} />
      <AllMovies mediaList={mediaList} />
    </main>
  );
}