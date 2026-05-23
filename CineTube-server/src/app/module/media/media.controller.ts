import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { MediaService } from "./media.service";


interface CustomRequest extends Request {
    user?: {
        id: string | number;
        role?: string;
        email?: string;
    }
}

const createMedia = catchAsync(
    async (req: Request, res: Response) => {
       
        const result = await MediaService.createMedia(req.body);
        
        sendResponse(res, {
            httpStatusCode: 201,
            success: true,
            message: 'Media created successfully',
            data: result
        });
    }
);

const getAllMedia = catchAsync(
    async (req: Request, res: Response) => {
       
        const customReq = req as CustomRequest;
        const loggedInUserId = customReq.user ? Number(customReq.user.id) : null; 
        
       
        const filters = req.query; 
        
        const result = await MediaService.getAllMedia(filters, loggedInUserId);
        
        sendResponse(res, {
            httpStatusCode: 200,
            success: true,
            message: 'Media list retrieved successfully',
            data: result
        });
    }
);

const getMediaById = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await MediaService.getMediaById(Number(id));
        
        sendResponse(res, {
            httpStatusCode: 200,
            success: true,
            message: 'Media details retrieved successfully',
            data: result
        });
    }
);

const updateMedia = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        
        
        const result = await MediaService.updateMedia(Number(id), req.body);
        
        sendResponse(res, {
            httpStatusCode: 200,
            success: true,
            message: 'Media updated successfully',
            data: result
        });
    }
);

const deleteMedia = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await MediaService.deleteMedia(Number(id));
        
        sendResponse(res, {
            httpStatusCode: 200,
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