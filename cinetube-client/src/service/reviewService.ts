import { httpClient, setAuthToken } from "@/lib/axios/httpClient";

// কুকি থেকে টোকেন পাওয়ার ফাংশন
const getToken = () => {
    if (typeof document === "undefined") return "";
    const name = "accessToken=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
    }
    return "";
};

export const createReview = async (data: { mediaId: string; rating: number; reviewText: string }) => {
    
    setAuthToken(getToken()); 

    try {
       
        return await httpClient.post(`/review`, data);
    } catch (error) {
        console.error("Error creating review:", error);
        throw error; 
    }
};