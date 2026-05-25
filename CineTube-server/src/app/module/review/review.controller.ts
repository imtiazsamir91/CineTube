import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { reviewService } from "./review.service";


const createReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { mediaId, rating, reviewText, isSpoiler, tags } = req.body;

    const result = await reviewService.createReview({
      userId,
      mediaId,
      rating: Number(rating),
      reviewText,
      isSpoiler,
      tags
    });

    res.status(httpStatus.CREATED).json({
      success: true,
      message: "Review submitted successfully!",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


const getMediaReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { mediaId } = req.params;
    const result = await reviewService.getMediaReviews(mediaId as string);

    res.status(httpStatus.OK).json({
      success: true,
      message: "Reviews fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};


const deleteReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { reviewId } = req.params;

    await reviewService.deleteReview(userId, reviewId as string);

    res.status(httpStatus.OK).json({
      success: true,
      message: "Review deleted successfully"
    });
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete review"
    });
  }
};


const toggleReviewLike = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { reviewId } = req.params;

    const result = await reviewService.toggleReviewLike(userId, reviewId as string);

    res.status(httpStatus.OK).json({
      success: true,
      message: result.message,
      data: { isLiked: result.isLiked }
    });
  } catch (error) {
    next(error);
  }
};

export const reviewController = {
  createReview,
  getMediaReviews,
  deleteReview,
  toggleReviewLike
};