import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { subscriptionService } from "./subscription.service";


const checkoutSuccess = async (req: Request, res: Response, next: NextFunction) => {
  try {
  
    const userId = req.user!.userId; 
    

    const { planType, amount } = req.body;

    if (!planType || !amount) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: "Missing required fields: planType or amount",
      });
    }

    const result = await subscriptionService.createPendingSubscription({
      userId,
      planType,
      amount: Number(amount), 
    });

    res.status(httpStatus.OK).json({
      success: true,
      message: "Subscription initialized. Use the clientSecret to pay via Stripe, and check email for OTP.",
      data: {
        subscriptionId: result.subscriptionId,
        clientSecret: result.clientSecret, 
      },
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


export const getMySubscriptionController = async (req: any, res: any, next: NextFunction) => {
  try {
    // authMiddleware থেকে প্রাপ্ত userId ব্যবহার করুন
    const userId = req.user.id; 
    
    const subscription = await subscriptionService.getMySubscription(userId);

    res.status(httpStatus.OK).json({
      success: true,
      message: "Active subscription details fetched successfully",
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
};

export const subscriptionController = {
  checkoutSuccess,
  verifyOtp,
  getMySubscription: getMySubscriptionController,
};