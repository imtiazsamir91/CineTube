"use client";

import {
  createComment,
  deleteComment,
  getComments,
} from "../../service/commentService";
import { useEffect, useState } from "react";

export default function Comments({
  reviewId,
}: {
  reviewId: string;
}) {
  const [comments, setComments] = useState<any[]>([]);
  const [text, setText] = useState("");

  const fetchComments = async () => {
    const data = await getComments(reviewId);
    setComments(data);
  };

  useEffect(() => {
    fetchComments();
  }, [reviewId]);

  const handlePost = async () => {
    if (!text) return;

   await createComment({
  reviewId,
  commentText: text,
});

    setText("");
    fetchComments();
  };

  const handleDelete = async (id: string) => {
    await deleteComment(id);
    fetchComments();
  };

  const renderComments = (items: any[]) => {
    return items.map((c) => (
      <div key={c.id} className="border-l pl-4 mb-4">
        <p className="text-white">{c.commentText}</p>

        <span className="text-gray-400 text-sm">
          {c.user.name}
        </span>

        <div className="flex gap-3 mt-1">
          <button
            onClick={() => handleDelete(c.id)}
            className="text-red-400 text-xs"
          >
            Delete
          </button>
        </div>

        {c.replies?.length > 0 && (
          <div className="ml-4 mt-2">
            {renderComments(c.replies)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="mt-10">
      <h2 className="text-xl text-white mb-3">
        Comments
      </h2>

      {/* input */}
      <div className="flex gap-2 mb-5">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 p-2 bg-zinc-900 text-white"
          placeholder="Write a comment..."
        />
        <button
          onClick={handlePost}
          className="bg-red-600 px-4 text-white"
        >
          Post
        </button>
      </div>

      {/* list */}
      <div>{renderComments(comments)}</div>
    </div>
  );
}