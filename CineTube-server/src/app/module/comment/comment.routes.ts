import express from "express";
import { authMiddleware } from "../../middleware/authMiddleware";
import { commentController } from "./comment.controller";

const router = express.Router();


router.post("/", authMiddleware, commentController.createComment);


router.get("/review/:reviewId", commentController.getReviewComments);


router.delete("/:commentId", authMiddleware, commentController.deleteComment);

router.patch("/:commentId", authMiddleware, commentController.updateComment);


router.patch("/:commentId/status", authMiddleware, commentController.toggleCommentStatus);

export const commentRoutes = router;