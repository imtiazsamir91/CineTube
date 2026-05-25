import express from "express";
import { authMiddleware } from "../../middleware/authMiddleware";
import { reviewController } from "./review.controller";

const router = express.Router();


router.post("/", authMiddleware, reviewController.createReview);


router.get("/media/:mediaId", reviewController.getMediaReviews);


router.delete("/:reviewId", authMiddleware, reviewController.deleteReview);


router.post("/:reviewId/like", authMiddleware, reviewController.toggleReviewLike);

export const reviewRoutes = router;