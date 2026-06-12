"use client";

import { createComment, deleteComment, getComments } from "../../service/commentService";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Comments({ review }: { review: any }) {
  const [comments, setComments] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const fetchComments = async () => {
    try {
      const data = await getComments(review.id);
      setComments(data || []);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  };

  useEffect(() => {
    if (showComments) fetchComments();
  }, [showComments, review.id]);

  const handlePost = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      await createComment({ reviewId: review.id, commentText: text.trim() });
      setText("");
      fetchComments();
      toast.success("Comment posted!");
    } catch (error) {
      toast.error("Failed to post comment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4 shadow-sm">
      {/* রিভিউয়ার তথ্য */}
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-bold text-red-500">{review.user?.name || "Anonymous"}</h4>
          <p className="text-gray-400 text-xs">{new Date(review.createdAt).toLocaleDateString()}</p>
        </div>
        <span className="text-xs bg-zinc-950 px-3 py-1 rounded-full text-zinc-300 border border-zinc-700">
          Rating: {review.rating}/10
        </span>
      </div>
      
      <p className="text-white text-sm leading-relaxed">{review.reviewText}</p>

      {/* কমেন্ট সেকশন টগল */}
      <button 
        onClick={() => setShowComments(!showComments)}
        className="text-xs text-zinc-500 hover:text-white transition"
      >
        {showComments ? "Hide Discussions" : "View Discussions"}
      </button>

      {showComments && (
        <div className="mt-4 pt-4 border-t border-zinc-800 space-y-4">
          <div className="flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="flex-1 p-2 bg-zinc-950 text-sm text-white rounded-lg border border-zinc-700"
              placeholder="Add a comment..."
            />
            <button
              onClick={handlePost}
              disabled={loading}
              className="bg-red-600 px-4 py-2 text-sm text-white rounded-lg disabled:opacity-50"
            >
              {loading ? "..." : "Reply"}
            </button>
          </div>

          <div className="space-y-3">
            {comments.map((c) => (
              <div key={c.id} className="pl-3 border-l-2 border-zinc-700">
                <p className="text-white text-xs">{c.commentText}</p>
                <span className="text-[10px] text-zinc-500 uppercase">{c.user?.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}