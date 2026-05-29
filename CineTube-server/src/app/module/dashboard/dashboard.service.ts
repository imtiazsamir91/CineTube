import { prisma } from "../../lib/prisma";


const getDashboardStats = async () => {
 
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

 
  const [
    totalUsers,
    totalMedia,
    totalViewsAggregate,
    totalReviews,
    newUsersLast7Days
  ] = await Promise.all([
    
    prisma.user.count(),

    
    prisma.media.count(),

    
    prisma.media.aggregate({
      _sum: {
        views: true
      }
    }),

   
    prisma.review.count(),

   
    prisma.user.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: sevenDaysAgo
        }
      },
      _count: {
        id: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    })
  ]);


  const registrationGraphData = newUsersLast7Days.map((item: any) => ({
    date: item.createdAt.toISOString().split('T')[0], 
    count: item._count.id
  }));

  return {
    summary: {
      totalUsers,
      totalMedia,
      totalPlatformViews: totalViewsAggregate._sum.views || 0,
      totalReviews
    },
    graphData: registrationGraphData
  };
};


const getTrendingMedia = async (limit: number = 5) => {
 
  const mostViewed = await prisma.media.findMany({
    orderBy: {
      views: 'desc'
    },
    take: limit,
    select: {
      id: true,
      title: true,
      posterUrl: true,
      views: true,
      releaseYear: true
    }
  });

 
  const reviewAggregation = await prisma.review.groupBy({
    by: ['mediaId'],
    _count: {
      id: true
    },
    orderBy: {
      _count: {
        id: 'desc'
      }
    },
    take: limit
  });


  const mostReviewedMediaIds = reviewAggregation.map((item: any) => item.mediaId);
  const mostReviewed = await prisma.media.findMany({
    where: {
      id: { in: mostReviewedMediaIds }
    },
    select: {
      id: true,
      title: true,
      posterUrl: true,
      releaseYear: true,
      pricingType: true
    }
  });

 
  const mostReviewedWithCount = mostReviewed.map(media => {
    const agg = reviewAggregation.find((item: any) => item.mediaId === media.id);
    return {
      ...media,
      reviewCount: agg?._count.id || 0
    };
  });

  return {
    mostViewed,
    mostReviewed: mostReviewedWithCount
  };
};

export const dashboardService = {
  getDashboardStats,
  getTrendingMedia
};