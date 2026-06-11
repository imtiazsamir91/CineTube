import { httpClient, setAuthToken } from "@/lib/axios/httpClient";

// কুকি থেকে টোকেন পাওয়ার ফাংশন (যদি প্রয়োজন হয়)
const getToken = () => {
    if (typeof document === "undefined") return "";
    const name = "accessToken=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i].trim();
      if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
};

export const getWatchlist = async () => {
    setAuthToken(getToken());
    try {
        return await httpClient.get(`/watchlist`);
    } catch (error) {
        console.error("Error fetching watchlist:", error);
        throw error;
    }
};

export const addToWatchlist = async (mediaId: string) => {
    setAuthToken(getToken());
    try {
        return await httpClient.post(`/watchlist`, { mediaId });
    } catch (error) {
        console.error("Error adding to watchlist:", error);
        throw error;
    }
};

export const removeFromWatchlist = async (mediaId: string) => {
    setAuthToken(getToken());
    try {
        return await httpClient.delete(`/watchlist/${mediaId}`);
    } catch (error) {
        console.error("Error removing from watchlist:", error);
        throw error;
    }
};