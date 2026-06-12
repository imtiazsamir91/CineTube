import { httpClient, setAuthToken } from "@/lib/axios/httpClient";


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
    return await httpClient.post(`/review`, data);
};

export const getMediaReviews = async (mediaId: string) => {
    return await httpClient.get(`/review/media/${mediaId}`);
};


export const deleteReview = async (reviewId: string) => {
    setAuthToken(getToken());
    return await httpClient.delete(`/review/${reviewId}`);
};


export const toggleReviewLike = async (reviewId: string) => {
    setAuthToken(getToken());
    return await httpClient.post(`/review/${reviewId}/like`);
};