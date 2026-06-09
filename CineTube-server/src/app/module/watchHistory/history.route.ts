import { Router } from "express";
import { watchHistoryController } from "./history.controller";
import { authMiddleware } from "../../middleware/authMiddleware";


const router = Router();


router.post("/record-view", authMiddleware(), watchHistoryController.recordInitialView);


router.post("/update-progress", authMiddleware(), watchHistoryController.updateProgress);


router.get("/continue-watching", authMiddleware(), watchHistoryController.getContinueWatching);

export const watchHistoryRoutes = router;