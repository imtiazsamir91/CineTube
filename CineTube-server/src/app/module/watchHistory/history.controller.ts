import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { watchHistoryService } from "./history.service";

const updateProgress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId; // আপনার সেই সলিড মিডলওয়্যার থেকে আসছে
    const { mediaId, currentPosition, duration } = req.body;

    const result = await watchHistoryService.updateProgress(
      userId,
      mediaId,
      Number(currentPosition),
      Number(duration)
    );

    res.status(httpStatus.OK).json({
      success: true,
      message: "Watch progress updated successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const getContinueWatching = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const result = await watchHistoryService.getContinueWatching(userId);

    res.status(httpStatus.OK).json({
      success: true,
      message: "Continue watching list fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const watchHistoryController = {
  updateProgress,
  getContinueWatching
};