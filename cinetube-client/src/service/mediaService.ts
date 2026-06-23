import { httpClient } from "@/lib/axios/httpClient";
import type { AxiosResponse } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;


export const createMedia = async (formData: FormData) => {
    try {
        const response: AxiosResponse = await httpClient.post(
            `${API_BASE_URL}/media`, 
            formData
        );
        return response.data;
    } catch (error) {
        console.error("Error creating media:", error);
        throw error;
    }
};


export const getMedias = async (queryParams: { search?: string; categories?: string; page?: string } = {}) => {
    try {
        const params = new URLSearchParams();
        if (queryParams?.search) params.append("search", queryParams.search);
        if (queryParams?.categories) params.append("categories", queryParams.categories);
        if (queryParams?.page) params.append("page", queryParams.page);

        const queryString = params.toString();
        const url = queryString ? `/media?${queryString}` : "/media";
        
        const response: any = await httpClient.get(`${API_BASE_URL}${url}`);
        return response?.data || []; 
    } catch (error) {
        console.error("Service Error:", error);
        return [];
    }
};


export const getMediaById = async (id: string) => {
    try {
        const response: AxiosResponse = await httpClient.get(`${API_BASE_URL}/media/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching media by id:", error);
        throw error;
    }
};


export const updateMedia = async (id: string, updateData: any) => {
    try {
        
        const response: AxiosResponse = await (httpClient as any).put(
            `${API_BASE_URL}/media/${id}`, 
            updateData
        );
        return response.data;
    } catch (error) {
        console.error("Error updating media:", error);
        throw error;
    }
};


export const deleteMedia = async (id: string) => {
    try {
        const response: AxiosResponse = await httpClient.delete(`${API_BASE_URL}/media/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting media:", error);
        throw error;
    }
};


export const getUserInfo = async () => {
    try {
        const response: AxiosResponse = await httpClient.get(`${API_BASE_URL}/auth/me`); 
        return response.data;
    } catch (error) {
        console.error("Error fetching user info:", error);
        return null;
    }
};

export const getNewTokensWithRefreshToken = async (refreshToken: string) => {
    try {
        const response: AxiosResponse = await httpClient.post(`${API_BASE_URL}/auth/refresh-token`, { refreshToken });
        return response.data;
    } catch (error) {
        console.error("Error refreshing token:", error);
        return null;
    }
};

export const logoutUser = async () => {
    try {
        await httpClient.post(`${API_BASE_URL}/auth/logout`, {}); 
        console.log("Logout successful");
        return { success: true };
    } catch (error) {
        console.error("Logout error:", error);
        return { success: false, error };
    }
};