"use server";

import { getDefaultDashboardRoute, isValidRedirectForRole, UserRole } from "@/lib/authUtils";
import { serverHttpClient } from "@/lib/axios/serverHttpClient";
// import { serverHttpClient } from "@/lib/axios/serverHttpClient";
import { setTokenInCookies } from "@/lib/tokenUtils";
import { ApiErrorResponse } from "@/types/api.types";
import { ILoginResponse } from "@/types/auth.types";
import { ILoginPayload, loginZodSchema } from "@/zod/auth.validation";
import { redirect } from "next/navigation";

export const loginAction = async (payload: ILoginPayload, redirectPath?: string): Promise<ILoginResponse | ApiErrorResponse> => {
    const parsedPayload = loginZodSchema.safeParse(payload);

    if (!parsedPayload.success) {
        return { success: false, message: "Invalid input" };
    }

    try {
        console.log("DEBUG: Attempting login for:", payload.email);
        
        const response = await serverHttpClient.post("/auth/login", parsedPayload.data);
        
        // এখানে পুরো রেসপন্স স্ট্রাকচার দেখুন
        console.log("DEBUG: Full API Response:", JSON.stringify(response.data, null, 2));

        const result = response.data?.data || response.data; 

        if (!result || !result.accessToken) {
            console.error("DEBUG: Access token missing in:", result);
            throw new Error("Login successful, but tokens are missing in response");
        }

        const { accessToken, refreshToken, token, user } = result;

        // কুকি সেট করার আগে ভ্যালু চেক করুন
        console.log("DEBUG: Setting accessToken cookie:", accessToken);
        
        await setTokenInCookies("accessToken", accessToken);
        await setTokenInCookies("refreshToken", refreshToken);
        await setTokenInCookies("better-auth.session_token", token, 24 * 60 * 60);

        // লগইন সফল হলে রিডাইরেক্ট
        const targetPath = redirectPath && isValidRedirectForRole(redirectPath, user.role as UserRole) 
            ? redirectPath 
            : getDefaultDashboardRoute(user.role as UserRole);
            
        redirect(targetPath);

    } catch (error: any) {
        if (error?.digest?.startsWith("NEXT_REDIRECT")) throw error;
        
        console.error("DEBUG: Login Action Error:", error?.response?.data || error.message);

        return {
            success: false,
            message: error?.response?.data?.message || "Login failed",
        };
    }
}