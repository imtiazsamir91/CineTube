"use client";

import { useState } from "react";
import { createReview } from "@/service/reviewService";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ReviewBox({ movieId }: { movieId: string }) {
  const [rating, setRating] = useState<number>(0);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (loading) return;

    if (rating < 1 || rating > 10) {
      toast.error("Please provide a rating between 1 and 10");
      return;
    }

    if (text.trim().length < 10) {
      toast.error("Review must be at least 10 characters long");
      return;
    }

    try {
      setLoading(true);
      await createReview({
        mediaId: movieId,
        rating,
        reviewText: text.trim(),
      });

      setText("");
      setRating(0);
      toast.success("Review posted successfully");
      router.refresh(); // এটি ডাটা রি-ফেচ করে পেজ আপডেট করবে
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to post review. Please login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 space-y-4">
      <h3 className="text-white font-semibold">Write a Review</h3>
      
      {/* রেটিং সিলেক্টর */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-400">Your Rating:</span>
        <select 
          value={rating} 
          onChange={(e) => setRating(Number(e.target.value))}
          className="bg-zinc-950 text-white p-1 rounded border border-zinc-700 outline-none"
        >
          <option value={0}>Select</option>
          {[...Array(10)].map((_, i) => (
            <option key={i + 1} value={i + 1}>{i + 1}</option>
          ))}
        </select>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-sm text-white focus:border-red-600 outline-none transition"
        rows={4}
        placeholder="What did you think about this movie?"
      />
      
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-red-600 hover:bg-red-700 disabled:bg-zinc-700 text-white font-medium py-2 rounded-lg transition"
      >
        {loading ? "Posting..." : "Post Review"}
      </button>
    </div>
  );
}