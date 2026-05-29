import { prisma } from "../../lib/prisma";


const updateProgress = async (
  userId: string, 
  mediaId: string, 
  currentPosition: number, 
  duration: number
) => {
  
  
  const isCompleted = duration > 0 ? (currentPosition / duration) >= 0.9 : false;

  
  const existingHistory = await prisma.watchHistory.findUnique({
    where: {
      userId_mediaId: { userId, mediaId }
    }
  });

  
  if (!existingHistory) {
    await prisma.media.update({
      where: { id: mediaId },
      data: {
        views: {
          increment: 1 
        }
      }
    });
    console.log(`🚀 Video ID: ${mediaId} - First time watch! View count incremented.`);
  }

 
  const history = await prisma.watchHistory.upsert({
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
    }
  });

  
  const freshMedia = await prisma.media.findUnique({
    where: { id: mediaId }
  });

  return {
    ...history,
    media: freshMedia
  };
};


const getContinueWatching = async (userId: string) => {
  return await prisma.watchHistory.findMany({
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