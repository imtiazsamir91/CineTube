import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { WatchlistService } from "./watchlist.service";

type AuthenticatedRequest = Omit<Request, "user"> & {
    user?: {
        userId?: string;
        [key: string]: any;
    };
};

const addToWatchlist = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.userId; 
    const { mediaId } = req.body;

    if (!userId || !mediaId) {
        throw new Error("User ID and media ID are required");
    }

    const result = await WatchlistService.addToWatchlist({ userId, mediaId });

    sendResponse(res, {
        httpStatusCode: status.CREATED,
        success: true,
        message: "Item added to watchlist successfully",
        data: result,
    });
});

const getMyWatchlist = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
        throw new Error("User ID is required");
    }

    const result = await WatchlistService.getMyWatchlist(userId);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Your watchlist loaded successfully",
        data: result,
    });
});

const removeFromWatchlist = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.userId;
    const { mediaId } = req.params; 

    if (!userId || !mediaId) {
        throw new Error("User ID and media ID are required");
    }

    await WatchlistService.removeFromWatchlist(userId, mediaId as string);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Item removed from watchlist successfully",
        data: null,
    });
});

export const WatchlistController = {
    addToWatchlist,
    getMyWatchlist,
    removeFromWatchlist,
};