"use client";

import { getContinueWatching } from "@/service/watchHistoryService";
import { useEffect, useState } from "react";
// import { getContinueWatching } from "@/services/watchHistory";

export default function ContinueWatching({
  token,
}: {
  token: string;
}) {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getContinueWatching();

        setVideos(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Continue Watching</h2>

      {videos.map((item) => (
        <div key={item.id}>
          <h3>{item.media?.title}</h3>

          <p>
            Progress:
            {Math.floor(
              (item.currentPosition /
                item.duration) *
                100
            )}
            %
          </p>
        </div>
      ))}
    </div>
  );
}