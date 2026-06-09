import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { watchHistoryService } from "./history.service";


const recordInitialView = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { mediaId } = req.body;

    const result = await watchHistoryService.recordInitialView(userId, mediaId);

    res.status(httpStatus.OK).json({
      success: true,
      message: "Initial watch record created successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const updateProgress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId; 
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
  recordInitialView, 
  updateProgress,
  getContinueWatching
};