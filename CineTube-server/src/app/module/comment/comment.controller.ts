import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { commentService } from "./comment.service";


const createComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId; 
    const { reviewId, commentText, parentCommentId } = req.body;

    if (!reviewId || !commentText) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: "reviewId and commentText are required.",
      });
    }

    const result = await commentService.createComment({
      reviewId,
      userId,
      commentText,
      parentCommentId,
    });

    res.status(httpStatus.CREATED).json({
      success: true,
      message: parentCommentId ? "Reply posted successfully" : "Comment posted successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};


const getReviewComments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { reviewId } = req.params;
    const result = await commentService.getReviewCommentsTree(reviewId as string);

    res.status(httpStatus.OK).json({
      success: true,
      message: "Comments tree fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};


const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { commentId } = req.params;

    await commentService.deleteComment(userId, commentId as string);

    res.status(httpStatus.OK).json({
      success: true,
      message: "Comment and its replies deleted successfully",
    });
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete comment",
    });
  }
};
const updateComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId; 
    const { commentId } = req.params;
    const { commentText } = req.body;

    if (!commentText) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: "Updated comment text is required",
      });
    }

    const result = await commentService.updateComment(userId, commentId as string , commentText);

    res.status(httpStatus.OK).json({
      success: true,
      message: "Comment updated successfully",
      data: result
    });
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to update comment"
    });
  }
};


const toggleCommentStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { commentId } = req.params;
    const { status } = req.body; 
    if (!status || !["APPROVED", "BLOCKED", "PENDING"].includes(status)) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const result = await commentService.toggleCommentStatus(commentId as string, status);

    res.status(httpStatus.OK).json({
      success: true,
      message: `Comment status updated to ${status} successfully`,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const commentController = {
  createComment,
  getReviewComments,
  deleteComment,
  updateComment,
  toggleCommentStatus,
};