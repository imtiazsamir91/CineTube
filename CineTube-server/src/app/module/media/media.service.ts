import { Media, PricingType } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

interface MediaFilters {
    search?: string;
    releaseYear?: string;
    sortBy?: string;
    page?: string;
    limit?: string;
}

const createMedia = async (payload: Media): Promise<Media> => {
    const media = await prisma.media.create({
        data: {
            title: payload.title,
            synopsis: payload.synopsis,
            releaseYear: Number(payload.releaseYear),
            director: payload.director || null,
            cast: payload.cast || null,
            streamingPlatforms: payload.streamingPlatforms || null,
            
            pricingType: (payload.pricingType as PricingType) || PricingType.FREE,
            videoLink: payload.videoLink || null,
            posterUrl: payload.posterUrl || null
        },
        
        include: {
            reviews: true,
            watchlist: true
        }
    });
    return media;
};

const getAllMedia = async (filters: MediaFilters, loggedInUserId: number | null = null): Promise<any[]> => {
    const { search, releaseYear, sortBy, page = "1", limit = "10" } = filters;
    const skip = (Number(page) - 1) * Number(limit);
    const where: any = {};

    // primium and free logic
    let hasActiveSubscription = false;
    if (loggedInUserId) {
        const activeSub = await prisma.subscription.findFirst({
            where: {
                userId: String(loggedInUserId),
                status: 'ACTIVE',
                endDate: { gte: new Date() }
            }
        });
        if (activeSub) hasActiveSubscription = true;
    }

   
    if (!hasActiveSubscription) {
        where.pricingType = 'FREE';
    }

   
    if (search) {
        where.OR = [
            { title: { contains: search, mode: 'insensitive' } },
            { director: { contains: search, mode: 'insensitive' } }
        ];
    }

    if (releaseYear) {
        where.releaseYear = Number(releaseYear);
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'latest') orderBy = { releaseYear: 'desc' };

    const data = await prisma.media.findMany({
        where,
        orderBy,
        skip: skip,
        take: Number(limit),
        include: { reviews: { select: { rating: true } },
                   watchlist: true }
    });

    // rating calculate avg and total reviews
    const formattedData = data.map(media => {
        const totalReviews = media.reviews.length;
        const avgRating = totalReviews > 0 
            ? media.reviews.reduce((acc, rev) => acc + rev.rating, 0) / totalReviews 
            : 0;

        return {
            ...media,
            averageRating: Number(avgRating.toFixed(1)),
            totalReviews
        };
    });

    if (sortBy === 'highest-rated') {
        formattedData.sort((a, b) => b.averageRating - a.averageRating);
    }

    return formattedData;
};

const getMediaById = async (id: string): Promise<any> => {
    const media = await prisma.media.findUnique({
        where: { id },
        include: {
            reviews: {
                where: { status: 'APPROVED' },
                include: { user: { select: { name: true } } }
            }
        }
    });
    if (!media) throw new Error('Media not found');
    return media;
};

const updateMedia = async (id: string, payload: Partial<Media>): Promise<Media> => {
    const media = await prisma.media.update({
        where: { id },
        data: payload
    });
    return media;
};

const deleteMedia = async (id: string): Promise<Media> => {
    const media = await prisma.media.delete({
        where: { id },
    });
    return media;
};

export const MediaService = {
    createMedia,
    getAllMedia,
    getMediaById,
    updateMedia,
    deleteMedia
};