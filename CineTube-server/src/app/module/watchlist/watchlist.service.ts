import status from "http-status";
import { prisma } from "../../lib/prisma";
import AppError from "../../errorHelpers/AppError";
import { IWatchlistPayload } from "./watchlist.interface";


const addToWatchlist = async (payload: IWatchlistPayload) => {
    const { userId, mediaId } = payload;

  
    const isAlreadyAdded = await prisma.watchlist.findUnique({
        where: {
            userId_mediaId: { userId, mediaId }
        }
    });

    if (isAlreadyAdded) {
        throw new AppError(status.BAD_REQUEST, "This item is already in your watchlist.");
    }

    const result = await prisma.watchlist.create({
        data: { userId, mediaId },
        include: {
            media: true
        }
    });

    return result;
};


const getMyWatchlist = async (userId: string) => {
    const result = await prisma.watchlist.findMany({
        where: { userId },
        orderBy: { 
            createdAt: "desc" 
        },
        include: { 
            media: true 
        } 
    });

    return result;
};


const removeFromWatchlist = async (userId: string, mediaId: string) => {
    const watchlistExists = await prisma.watchlist.findUnique({
        where: {
            userId_mediaId: { userId, mediaId }
        }
    }); 

    if (!watchlistExists) {
        throw new AppError(status.NOT_FOUND, "This item is not in your watchlist.");
    }

   
    const result = await prisma.watchlist.delete({
        where: {
            userId_mediaId: { userId, mediaId }
        }
    });

    return result;
};

export const WatchlistService = {
    addToWatchlist,
    getMyWatchlist,
    removeFromWatchlist
};