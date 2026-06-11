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
      toast.error("Rating must be between 1-10");
      return;
    }

    if (text.trim().length < 10) {
      toast.error("Review must be at least 10 characters");
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
      router.refresh(); 
    } catch (err: any) {
      console.error(err);
      
      toast.error(err.response?.data?.message || "Failed to post review. Please login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-3">
      
      <input
        type="number"
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        className="w-full bg-zinc-900 p-2 rounded text-white border border-zinc-700"
        placeholder="Rating (1-10)"
      />
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-sm text-white"
        rows={4}
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded"
      >
        {loading ? "Posting..." : "Post Review"}
      </button>
    </div>
  );
}