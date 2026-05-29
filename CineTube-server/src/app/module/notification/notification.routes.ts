import express from "express";
import { authMiddleware } from "../../middleware/authMiddleware";
import { notificationController } from "./notification.controller";

const router = express.Router();


router.use(authMiddleware());

router.get("/", notificationController.getMyNotifications);


router.patch("/:id/read", notificationController.readNotification);

export const notificationRoutes = router;