import express from "express";
import { authMiddleware } from "../../middleware/authMiddleware";
import { watchHistoryController } from "./history.controller";

const router = express.Router();


router.post("/update", authMiddleware(), watchHistoryController.updateProgress);


router.get("/continue-watching", authMiddleware()  , watchHistoryController.getContinueWatching);

export const watchHistoryRoutes = router;