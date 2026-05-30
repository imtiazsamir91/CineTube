"use server";

import { setTokenInCookies } from "@/lib/tokenUtils";
import { cookies } from "next/headers";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_API_URL) {
    throw new Error("API_BASE_URL is not defined in environment variables");
}

export async function registerUser(userData: Record<string, unknown>) {
    try {
        const res = await fetch(`${BASE_API_URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        const result = await res.json();
        
        if (!res.ok) {
            throw new Error(result?.message || "Registration failed!");
        }

        return result;
    } catch (error: any) {
        console.error("Error in registerUser service:", error);
        throw error;
    }
}

export async function loginUser(loginData: Record<string, unknown>) {
    try {
        const res = await fetch(`${BASE_API_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(loginData),
        });

        const result = await res.json();

        if (!res.ok) {
            throw new Error(result?.message || "Login failed!");
        }

        if (result?.success && result?.data) {
            const { accessToken, refreshToken, token } = result.data;

            if (accessToken) {
                await setTokenInCookies("accessToken", accessToken);
            }
            if (refreshToken) {
                await setTokenInCookies("refreshToken", refreshToken);
            }
            if (token) {
                await setTokenInCookies("better-auth.session_token", token, 24 * 60 * 60);
            }
        }

        return result;
    } catch (error: any) {
        console.error("Error in loginUser service:", error);
        throw error;
    }
}

export async function getNewTokensWithRefreshToken(refreshToken: string): Promise<boolean> {
    try {
        const res = await fetch(`${BASE_API_URL}/auth/refresh-token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: `refreshToken=${refreshToken}`
            }
        });

        if (!res.ok) {
            return false;
        }

        const { data } = await res.json();
        const { accessToken, refreshToken: newRefreshToken, token } = data;

        if (accessToken) {
            await setTokenInCookies("accessToken", accessToken);
        }

        if (newRefreshToken) {
            await setTokenInCookies("refreshToken", newRefreshToken);
        }

        if (token) {
            await setTokenInCookies("better-auth.session_token", token, 24 * 60 * 60);
        }

        return true;
    } catch (error) {
        console.error("Error refreshing token:", error);
        return false;
    }
}

export async function getUserInfo() {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;
        const sessionToken = cookieStore.get("better-auth.session_token")?.value;

        if (!accessToken) {
            return null;
        }

        const res = await fetch(`${BASE_API_URL}/auth/me`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`
            }
        });

        if (!res.ok) {
            console.error("Failed to fetch user info:", res.status, res.statusText);
            return null;
        }

        const { data } = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching user info:", error);
        return null;
    }
}

export async function logoutUser() {
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    cookieStore.delete("better-auth.session_token");
    return { success: true, message: "Logged out successfully" };
}