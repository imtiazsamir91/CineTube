"use server";

import { cookies } from "next/headers";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_API_URL) {
    throw new Error("API_BASE_URL is not defined in environment variables");
}


export async function getAdminDashboardMeta() {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;
        const sessionToken = cookieStore.get("better-auth.session_token")?.value;

        
        if (!accessToken) {
            return null;
        }

        const res = await fetch(`${BASE_API_URL}/dashboard/admin-stats`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                
                Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`
            },
            next: { revalidate: 0 } 
        });

        if (!res.ok) {
            console.error("Failed to fetch admin stats:", res.status, res.statusText);
            return null;
        }

        const result = await res.json();
        return result.data; 
    } catch (error) {
        console.error("Error in getAdminDashboardMeta service:", error);
        return null;
    }
}


export async function getTrendingAnalytics(limit: number = 5) {
    try {
        
        const res = await fetch(`${BASE_API_URL}/dashboard/trending?limit=${limit}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            next: { revalidate: 3600 } 
        });

        if (!res.ok) {
            console.error("Failed to fetch trending analytics:", res.status, res.statusText);
            return null;
        }

        const result = await res.json();
        return result.data; 
    } catch (error) {
        console.error("Error in getTrendingAnalytics service:", error);
        return null;
    }
}