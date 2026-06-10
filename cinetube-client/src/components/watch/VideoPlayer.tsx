"use client";

import { recordInitialView, updateWatchProgress } from "@/service/watchHistoryService";
import { useEffect, useRef } from "react";
// import {
//   recordInitialView,
//   updateWatchProgress,
// } from "@/services/watchHistoryService";

interface Props {
  mediaId: string;
  videoUrl: string;
}

export default function VideoPlayer({
  mediaId,
  videoUrl,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastSaved = useRef(0);

  // প্রথমবার ভিডিও ওপেন হলে view record
  useEffect(() => {
    recordInitialView(mediaId).catch(console.error);
  }, [mediaId]);

  // progress tracking
  const handleTimeUpdate = async () => {
    const video = videoRef.current;
    if (!video) return;

    const now = Date.now();

    // প্রতি 10 sec পর save
    if (now - lastSaved.current < 10000) return;

    lastSaved.current = now;

    try {
      await updateWatchProgress(
        mediaId,
        video.currentTime,
        video.duration
      );
    } catch (err) {
      console.error("Progress update failed", err);
    }
  };

  return (
    <video
      ref={videoRef}
      controls
      className="w-full h-full object-cover"
      onTimeUpdate={handleTimeUpdate}
    >
      <source src={videoUrl} type="video/mp4" />
      Your browser does not support video.
    </video>
  );
}