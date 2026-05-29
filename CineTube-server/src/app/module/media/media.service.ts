import { Media, PricingType, VideoQuality } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";


interface MediaFilters {
    search?: string;
    releaseYear?: string;
    sortBy?: string;
    videoQuality?: VideoQuality; 
    categories?: string;         
    page?: string;
    limit?: string;
}


const createMedia = async (payload: Media & { categories: string[], videoQuality?: VideoQuality }): Promise<Media> => {
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
            posterUrl: payload.posterUrl || null,
            duration: payload.duration ? Number(payload.duration) : 0, 
            views: 0, 
            videoQuality: payload.videoQuality || VideoQuality.FHD, 
            categories: payload.categories || [] 
        },
        include: {
            reviews: true,
            watchlist: true
        }
    });
    return media;
};


const getAllMedia = async (filters: MediaFilters, loggedInUserId: number | null = null): Promise<any> => {
    const { search, releaseYear, sortBy, videoQuality, categories, page = "1", limit = "10" } = filters;
    const skip = (Number(page) - 1) * Number(limit);
    const where: any = {};

   
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
            { director: { contains: search, mode: 'insensitive' } },
            { cast: { contains: search, mode: 'insensitive' } },
            { synopsis: { contains: search, mode: 'insensitive' } }
        ];
    }

    
    if (releaseYear) {
        where.releaseYear = Number(releaseYear);
    }

    
    if (videoQuality) {
        where.videoQuality = videoQuality;
    }

    
    if (categories) {
        const categoriesArray = categories.split(',').map(cat => cat.trim());
        where.categories = {
            hasEvery: categoriesArray 
        };
    }

   
    let orderBy: any = { createdAt: 'desc' }; 
    if (sortBy === 'latest') orderBy = { releaseYear: 'desc' };
    if (sortBy === 'trending') orderBy = { views: 'desc' }; 

    
    const [data, totalCount] = await Promise.all([
        prisma.media.findMany({
            where,
            orderBy,
            skip: skip,
            take: Number(limit),
            include: { 
                reviews: { select: { rating: true } },
                watchlist: true 
            }
        }),
        prisma.media.count({ where })
    ]);

   
    let formattedData = data.map(media => {
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

   
    return {
        meta: {
            totalData: totalCount,
            page: Number(page),
            limit: Number(limit),
            totalPage: Math.ceil(totalCount / Number(limit))
        },
        movies: formattedData
    };
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


const updateMedia = async (id: string, payload: Partial<Media & { categories: string[] }>): Promise<Media> => {
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