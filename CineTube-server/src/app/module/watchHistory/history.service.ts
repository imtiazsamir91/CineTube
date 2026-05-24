import { prisma } from "../../lib/prisma";


const updateProgress = async (
  userId: string, 
  mediaId: string, 
  currentPosition: number, 
  duration: number
) => {
  
  const isCompleted = (currentPosition / duration) >= 0.9;

  const history = await (prisma as any).watchHistory.upsert({
    where: {
      userId_mediaId: { userId, mediaId } 
    },
    update: {
      currentPosition,
      isCompleted,
      duration
    },
    create: {
      userId,
      mediaId,
      currentPosition,
      duration,
      isCompleted
    },
    include: { media: true }
  });

  return history;
};


const getContinueWatching = async (userId: string) => {
  return await (prisma as any).watchHistory.findMany({
    where: {
      userId,
      isCompleted: false 
    },
    orderBy: {
      updatedAt: 'desc'
    },
    include: {
      media: true
    }
  });
};

export const watchHistoryService = {
  updateProgress,
  getContinueWatching
};