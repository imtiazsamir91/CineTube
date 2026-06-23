import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { MediaService } from "./media.service";
import httpStatus from "http-status"; 

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        id: string;
        role: "USER" | "ADMIN"; 
        email?: string | null;
      };
      files?: any; 
    }
  }
}

const createMedia = catchAsync(
    async (req: Request, res: Response) => {
        const files = req.files as any;
        let posterUrl = null;
        let videoLink = null;

        
        if (files) {
            if (!Array.isArray(files)) {
                posterUrl = files["coverImage"]?.[0]?.path || files["posterUrl"]?.[0]?.path || null;
                videoLink = files["videoFile"]?.[0]?.path || files["videoLink"]?.[0]?.path || null;
            } else {
                const coverFile = files.find((f: any) => f.fieldname === "coverImage" || f.fieldname === "posterUrl");
                const vidFile = files.find((f: any) => f.fieldname === "videoFile" || f.fieldname === "videoLink");
                if (coverFile) posterUrl = coverFile.path;
                if (vidFile) videoLink = vidFile.path;
            }
        }

        const { id, createdAt, releaseYear, duration, ...mediaData } = req.body;
        
       
        const mediaPayload = {
            ...mediaData,
            title: req.body.title, // টাইটেল সরাসরি বাইন্ড করা হলো
            releaseYear: releaseYear ? Number(releaseYear) : new Date().getFullYear(),
            duration: duration ? Number(duration) : 0,
            posterUrl, 
            videoLink, 
        };
        
        const result = await MediaService.createMedia(mediaPayload);
        
        sendResponse(res, {
            httpStatusCode: httpStatus.CREATED, 
            success: true,
            message: 'Media created successfully with Cloudinary links',
            data: result
        });
    }
);

const getAllMedia = catchAsync(
    async (req: Request, res: Response) => { 
        const loggedInUserId = req.user?.id ? String(req.user.id) : null; 
        const filters = req.query; 
        
        const result = await MediaService.getAllMedia(filters as any, loggedInUserId);
        
        sendResponse(res, {
            httpStatusCode: httpStatus.OK, 
            success: true,
            message: 'Media list retrieved successfully',
            meta: result.meta, 
            data: result.movies 
        });
    }
);

const getMediaById = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await MediaService.getMediaById(String(id));
        
        sendResponse(res, {
            httpStatusCode: httpStatus.OK,
            success: true,
            message: 'Media details retrieved successfully',
            data: result
        });
    }
);

const updateMedia = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const { id: bodyId, createdAt, ...updateData } = req.body;
        
        if (updateData.releaseYear) updateData.releaseYear = Number(updateData.releaseYear);
        if (updateData.duration) updateData.duration = Number(updateData.duration);
        
        const result = await MediaService.updateMedia(String(id), updateData);
        
        sendResponse(res, {
            httpStatusCode: httpStatus.OK,
            success: true,
            message: 'Media updated successfully',
            data: result
        });
    }
);

const deleteMedia = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await MediaService.deleteMedia(String(id));
        
        sendResponse(res, {
            httpStatusCode: httpStatus.OK,
            success: true,
            message: 'Media deleted successfully',
            data: result
        });
    }
);

export const MediaController = {
    createMedia,
    getAllMedia,
    getMediaById,
    updateMedia,
    deleteMedia
};