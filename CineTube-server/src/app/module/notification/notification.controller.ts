import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { notificationService } from "./notification.service";


const getMyNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId; 
    const data = await notificationService.getUserNotifications(userId);
    
    res.status(httpStatus.OK).json({
      success: true,
      message: "Notifications fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};


const readNotification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params; 

    const updatedNotification = await notificationService.markAsRead(userId, id as string);

    res.status(httpStatus.OK).json({
      success: true,
      message: "Notification marked as read",
      data: updatedNotification,
    });
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to update notification",
    });
  }
};

export const notificationController = {
  getMyNotifications,
  readNotification,
};