import { prisma } from "../../lib/prisma";


const createReview = async (payload: {
  userId: string;
  mediaId: string;
  rating: number;
  reviewText: string;
  isSpoiler?: boolean;
  tags?: string;
}) => {
 
  if (payload.rating < 1 || payload.rating > 10) {
    throw new Error("Rating must be between 1 and 10!");
  }

  return await prisma.review.create({
    data: payload,
    include: {
      user: {
        select: { id: true, name: true, email: true }
      }
    }
  });
};


const getMediaReviews = async (mediaId: string) => {
  return await prisma.review.findMany({
    where: {
      mediaId,
      status: "APPROVED" 
    },
    orderBy: {
      createdAt: "desc" 
    },
    include: {
      user: {
        select: { id: true, name: true }
      },
      _count: {
        select: {
          reviewLikes: true, 
          comments: true     
        }
      }
    }
  });
};


const deleteReview = async (userId: string, reviewId: string) => {
  const review = await prisma.review.findUnique({ where: { id: reviewId } });

  if (!review) {
    throw new Error("Review not found");
  }
  
  if (review.userId !== userId) {
    throw new Error("You are not authorized to delete this review");
  }

  return await prisma.review.delete({ where: { id: reviewId } });
};


const toggleReviewLike = async (userId: string, reviewId: string) => {
  const existingLike = await prisma.reviewLike.findUnique({
    where: {
      userId_reviewId: { userId, reviewId }
    }
  });

  if (existingLike) {
    await prisma.reviewLike.delete({
      where: {
        userId_reviewId: { userId, reviewId }
      }
    });
    return { isLiked: false, message: "Review unliked successfully" };
  } else {
    await prisma.reviewLike.create({
      data: { userId, reviewId }
    });
    return { isLiked: true, message: "Review liked successfully" };
  }
};

export const reviewService = {
  createReview,
  getMediaReviews,
  deleteReview,
  toggleReviewLike
};