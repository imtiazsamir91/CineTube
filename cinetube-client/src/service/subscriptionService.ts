"use server";

import { cookies } from "next/headers";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;


const getAuthHeaders = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const sessionToken = cookieStore.get("better-auth.session_token")?.value;

  return {
    "Content-Type": "application/json",
    Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
  };
};


export async function createCheckout(payload: { planType: string; amount: number }) {
  try {
    const res = await fetch(`${BASE_API_URL}/subscription/checkout-success`, {
      method: "POST",
      headers: await getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result?.message || "Failed to initialize subscription");
    
    return result;
  } catch (error) {
    console.error("createCheckout error:", error);
    throw error;
  }
}


export async function verifySubscriptionOtp(otp: string) {
  try {
    const res = await fetch(`${BASE_API_URL}/subscription/verify-otp`, {
      method: "POST",
      headers: await getAuthHeaders(),
      body: JSON.stringify({ otp }),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result?.message || "OTP Verification failed");
    
    return result;
  } catch (error) {
    console.error("verifySubscriptionOtp error:", error);
    throw error;
  }
}


export async function getMySubscriptionStatus() {
  try {
    const res = await fetch(`${BASE_API_URL}/subscription/my-status`, {
      method: "GET",
      headers: await getAuthHeaders(),
      cache: "no-store",
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result?.message || "Failed to fetch status");
    
    return result.data;
  } catch (error) {
    console.error("getMySubscriptionStatus error:", error);
    return null;
  }
}