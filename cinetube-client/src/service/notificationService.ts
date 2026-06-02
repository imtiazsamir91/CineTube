"use server";

// import { clientHttpClient } from "@/lib/axios/httpClient";

import { httpClient } from "@/lib/axios/httpClient";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

export const getMyNotifications = async () => {
  try {
   
    const response = await httpClient.get<{ data: any }>(`${API_BASE_URL}/notification`);
    

    return response.data?.data || [];
  } catch (error) {
    console.error("Error in getMyNotifications:", error);
    return [];
  }
};

export const markNotificationAsRead = async (id: string) => {
    try {
        
        const response = await httpClient.patch<{ data: any }>(`${API_BASE_URL}/notification/${id}/read`, {});
        return response.data?.data || {};
    } catch (error) {
        console.error(`Error marking notification ${id} as read:`, error);
        throw error;
    }
}