// src/service/watchlistService.ts
import { httpClient } from "@/lib/axios/httpClient";

// যেহেতু httpClient-এ baseURL দেওয়া আছে, তাই এখানে আর তা যোগ করার প্রয়োজন নেই
export const getWatchlist = async () => {
    return await httpClient.get(`/watchlist`);
};

export const addToWatchlist = async (mediaId: string) => {
    return await httpClient.post(`/watchlist`, { mediaId });
};

export const removeFromWatchlist = async (mediaId: string) => {
    return await httpClient.delete(`/watchlist/${mediaId}`);
};