import express from "express";
import { authMiddleware } from "../../middleware/authMiddleware";
import { dashboardController } from "./dashboard.controller";

const router = express.Router();


router.get("/admin-stats", authMiddleware(), dashboardController.getAdminDashboardMeta);

router.get("/trending", dashboardController.getTrendingAnalytics);

export const dashboardRoutes = router;