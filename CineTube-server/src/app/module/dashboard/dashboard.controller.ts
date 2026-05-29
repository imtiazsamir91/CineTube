import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { dashboardService } from "./dashboard.service";


const getAdminDashboardMeta = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await dashboardService.getDashboardStats();
    
    res.status(httpStatus.OK).json({
      success: true,
      message: "Admin dashboard stats fetched successfully",
      data: stats
    });
  } catch (error) {
    next(error);
  }
};


const getTrendingAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 5;
    const trending = await dashboardService.getTrendingMedia(limit);

    res.status(httpStatus.OK).json({
      success: true,
      message: "Trending movies data fetched successfully",
      data: trending
    });
  } catch (error) {
    next(error);
  }
};

export const dashboardController = {
  getAdminDashboardMeta,
  getTrendingAnalytics
};