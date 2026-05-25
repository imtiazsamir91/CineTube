import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { subscriptionService } from "./subscription.service";


const checkoutSuccess = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId; 
    const { stripePaymentId, planType, amount } = req.body;

    const result = await subscriptionService.createPendingSubscription({
      userId,
      stripePaymentId,
      planType,
      amount: Number(amount), 
    });

    res.status(httpStatus.OK).json({
      success: true,
      message: "Payment tracked successfully. Check your email for activation OTP.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};


const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { otp } = req.body;

    if (!otp) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: "OTP code is required to activate subscription.",
      });
    }

    const result = await subscriptionService.verifySubscriptionOtp(userId, otp);

    res.status(httpStatus.OK).json({
      success: true,
      message: "Subscription activated successfully! Enjoy your Premium access.",
      data: result,
    });
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: error instanceof Error ? error.message : "OTP Verification failed",
    });
  }
};


const getMySubscription = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const result = await subscriptionService.getMySubscription(userId);

    if (!result) {
      return res.status(httpStatus.OK).json({
        success: true,
        message: "Subscription details fetched successfully",
        data: { message: "No active subscription found. You are a FREE user." },
      });
    }

    res.status(httpStatus.OK).json({
      success: true,
      message: "Active subscription details fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const subscriptionController = {
  checkoutSuccess,
  verifyOtp,
  getMySubscription,
};