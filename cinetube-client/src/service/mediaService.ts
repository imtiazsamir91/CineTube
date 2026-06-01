"use server";

import { httpClient } from "@/lib/axios/httpClient"; 

export const getMedias = async (queryString: string = "") => {
    try {
        const url = queryString ? `/media?${queryString}` : "/media";
        const response = await httpClient.get(url);
        return response;
    } catch (error) {
        console.log("Error fetching medias:", error);
        throw error;
    }
}

export const getMediaById = async (id: string) => {
    try {
        const response = await httpClient.get(`/media/${id}`);
        return response;
    } catch (error) {
        console.log("Error fetching media by id:", error);
        throw error;
    }
}

export const createMedia = async (payload: any) => {
    try {
        const response = await httpClient.post("/media/create", payload);
        return response;
    } catch (error) {
        console.log("Error creating media:", error);
        throw error;
    }
}

export const updateMedia = async (id: string, payload: any) => {
    try {
        const response = await httpClient.patch(`/media/${id}`, payload);
        return response;
    } catch (error) {
        console.log("Error updating media:", error);
        throw error;
    }
}

export const deleteMedia = async (id: string) => {
    try {
        const response = await httpClient.delete(`/media/${id}`);
        return response;
    } catch (error) {
        console.log("Error deleting media:", error);
        throw error;
    }
}