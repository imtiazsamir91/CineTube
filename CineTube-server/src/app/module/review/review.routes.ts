import express from "express";
import { authMiddleware } from "../../middleware/authMiddleware";
import { validateRequest } from "../../middleware/validateRequest"; // ৩টি ডট-ডট (../) দিয়ে ট্রাই করুন // 💡 আপনার প্রজেক্টের ভ্যালিডেশন মিডলওয়্যার
import { reviewController } from "./review.controller";
import { reviewValidation } from "./review.validation";

const router = express.Router();


router.post(
  "/", 
  authMiddleware(), 
  validateRequest(reviewValidation.createReviewValidationSchema), 
  reviewController.createReview
);

router.get("/media/:mediaId", reviewController.getMediaReviews);
router.delete("/:reviewId", authMiddleware("ADMIN"), reviewController.deleteReview);
router.post("/:reviewId/like", authMiddleware(), reviewController.toggleReviewLike);

export const reviewRoutes = router;