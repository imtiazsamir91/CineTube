"use client";

import { useState } from "react";

export default function Rating({
  mediaId,
  initialRating,
}: {
  mediaId: string;
  initialRating: number;
}) {
  const [rating, setRating] = useState(initialRating);

  const handleRate = async (value: number) => {
    setRating(value);

    await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/rating`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mediaId,
          rating: value,
        }),
      }
    );
  };

  return (
    <div className="flex items-center gap-2 text-yellow-400">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => handleRate(star)}
          className={
            star <= rating ? "text-yellow-400" : "text-zinc-600"
          }
        >
          ★
        </button>
      ))}

      <span className="text-sm text-zinc-400 ml-2">
        {rating}/5
      </span>
    </div>
  );
}