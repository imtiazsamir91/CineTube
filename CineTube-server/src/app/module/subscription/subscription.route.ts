import express from "express";
import { authMiddleware } from "../../middleware/authMiddleware"; 
import { subscriptionController } from "./subscription.controller";

const router = express.Router();


router.post("/checkout-success", authMiddleware, subscriptionController.checkoutSuccess);


router.post("/verify-otp", authMiddleware, subscriptionController.verifyOtp);

router.get("/my-status", authMiddleware, subscriptionController.getMySubscription);

export const subscriptionRoutes = router;