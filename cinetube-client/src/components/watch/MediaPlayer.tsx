"use client";

import ReactPlayer from "react-player";
import { useEffect, useRef } from "react";
import {
  recordInitialView,
  updateWatchProgress,
} from "@/service/watchHistoryService";

const ReactPlayerAny = ReactPlayer as any;

interface Props {
  mediaId: string;
  videoUrl: string;
  token: string;
}

type PlayerRef = {
  getDuration: () => number;
};

export default function VideoPlayer({
  mediaId,
  videoUrl,
  token,
}: Props) {
  // use a loose ref type to satisfy ReactPlayer's ref typing
  const playerRef = useRef<PlayerRef | null>(null);
  const lastSavedRef = useRef(0);

  useEffect(() => {
    if (!mediaId) return;

    recordInitialView(mediaId).catch(console.error);
  }, [mediaId]);

  type ProgressState = {
    playedSeconds: number;
  };

  const handleProgress = (progress: ProgressState) => {
    const { playedSeconds } = progress;
    const now = Date.now();

    // save every 10 sec
    if (now - lastSavedRef.current < 10000) return;

    lastSavedRef.current = now;

    const duration = playerRef.current?.getDuration?.() || 0;

    updateWatchProgress(mediaId, playedSeconds, duration).catch(
      console.error
    );
  };

  return (
    <ReactPlayerAny
      // cast to any because ReactPlayer's ref types differ across versions
      ref={playerRef as any}
      url={videoUrl}
      controls
      width="100%"
      height="100%"
      onProgress={(progress: any) => handleProgress(progress)}
    />
  );
}