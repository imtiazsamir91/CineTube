import { NextFunction, Request, Response } from "express";
import { subscriptionService } from "./subscription.service";
import httpStatus from "http-status";



const checkoutSuccess = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId; 
    const { stripePaymentId, planType, amount } = req.body;

    
    const result = await subscriptionService.createSubscription({
      userId,
      stripePaymentId,
      planType,
      amount: Number(amount),
    });

    res.status(httpStatus.CREATED).json({
      success: true,
      message: "Subscription activated successfully! Enjoy your Premium access.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const subscriptionController = {
  checkoutSuccess,
};