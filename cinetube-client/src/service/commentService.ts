"use server";

import { cookies } from "next/headers";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_API_URL) {
  throw new Error("API_BASE_URL is not defined in environment variables");
}

/* =========================
   COMMON HEADERS
========================= */
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

/* =========================
   GET COMMENTS TREE
========================= */
export async function getComments(reviewId: string) {
  try {
    const res = await fetch(
      `${BASE_API_URL}/comment/review/${reviewId}`,
      {
        method: "GET",
        headers: await getAuthHeaders(),
        cache: "no-store",
      }
    );

    const result = await res.json();

    if (!res.ok) {
      throw new Error(
        result?.message || "Failed to fetch comments"
      );
    }

    return result.data;
  } catch (error) {
    console.error("getComments error:", error);
    return [];
  }
}

/* =========================
   CREATE COMMENT / REPLY
========================= */
export async function createComment(payload: {
  reviewId: string;
  commentText: string;
  parentCommentId?: string;
}) {
  try {
    const res = await fetch(`${BASE_API_URL}/comment`, {
      method: "POST",
      headers: await getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(
        result?.message || "Failed to create comment"
      );
    }

    return result.data;
  } catch (error) {
    console.error("createComment error:", error);
    throw error;
  }
}

/* =========================
   DELETE COMMENT
========================= */
export async function deleteComment(commentId: string) {
  try {
    const res = await fetch(
      `${BASE_API_URL}/comment/${commentId}`,
      {
        method: "DELETE",
        headers: await getAuthHeaders(),
      }
    );

    const result = await res.json();

    if (!res.ok) {
      throw new Error(
        result?.message || "Failed to delete comment"
      );
    }

    return result;
  } catch (error) {
    console.error("deleteComment error:", error);
    throw error;
  }
}

/* =========================
   UPDATE COMMENT
========================= */
export async function updateComment(
  commentId: string,
  commentText: string
) {
  try {
    const res = await fetch(
      `${BASE_API_URL}/comment/${commentId}`,
      {
        method: "PATCH",
        headers: await getAuthHeaders(),
        body: JSON.stringify({ commentText }),
      }
    );

    const result = await res.json();

    if (!res.ok) {
      throw new Error(
        result?.message || "Failed to update comment"
      );
    }

    return result.data;
  } catch (error) {
    console.error("updateComment error:", error);
    throw error;
  }
}

/* =========================
   ADMIN: TOGGLE STATUS
========================= */
export async function toggleCommentStatus(
  commentId: string,
  status: "APPROVED" | "PENDING" | "UNPUBLISHED"
) {
  try {
    const res = await fetch(
      `${BASE_API_URL}/comment/${commentId}/status`,
      {
        method: "PATCH",
        headers: await getAuthHeaders(),
        body: JSON.stringify({ status }),
      }
    );

    const result = await res.json();

    if (!res.ok) {
      throw new Error(
        result?.message || "Failed to update status"
      );
    }

    return result.data;
  } catch (error) {
    console.error("toggleCommentStatus error:", error);
    throw error;
  }
}