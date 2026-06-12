"use server";

import { cookies } from "next/headers";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_API_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

const getAuthHeaders = async () => {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;
  const sessionToken = cookieStore.get(
    "better-auth.session_token"
  )?.value;

  return {
    "Content-Type": "application/json",
    Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
  };
};



export async function recordInitialView(mediaId: string) {
  try {
    const res = await fetch(
      `${BASE_API_URL}/watch-history/record-view`,
      {
        method: "POST",
        headers: await getAuthHeaders(),
        body: JSON.stringify({ mediaId }),
      }
    );

    const result = await res.json();

    if (!res.ok) {
      throw new Error(
        result?.message || "Failed to record view"
      );
    }

    return result;
  } catch (error) {
    console.error("recordInitialView error:", error);
    throw error;
  }
}

export async function updateWatchProgress(
  mediaId: string,
  currentPosition: number,
  duration: number
) {
  try {
    const res = await fetch(
      `${BASE_API_URL}/watch-history/update-progress`,
      {
        method: "POST",
        headers: await getAuthHeaders(),
        body: JSON.stringify({
          mediaId,
          currentPosition,
          duration,
        }),
      }
    );

    const result = await res.json();

    if (!res.ok) {
      throw new Error(
        result?.message || "Failed to update progress"
      );
    }

    return result;
  } catch (error) {
    console.error("updateWatchProgress error:", error);
    throw error;
  }
}

export async function getContinueWatching() {
  try {
    const res = await fetch(
      `${BASE_API_URL}/watch-history/continue-watching`,
      {
        method: "GET",
        headers: await getAuthHeaders(),
        cache: "no-store",
      }
    );

    const result = await res.json();

    if (!res.ok) {
      throw new Error(
        result?.message ||
          "Failed to fetch continue watching"
      );
    }

    return result.data;
  } catch (error) {
    console.error("getContinueWatching error:", error);
    return [];
  }
}