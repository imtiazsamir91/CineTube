import { PlanType, SubscriptionStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import crypto from "crypto";
import { sendEmail } from "../../utils/email"; // 
import { Prisma } from "../../../generated/prisma/client";





const createPendingSubscription = async (payload: {
  userId: string;
  stripePaymentId: string;
  planType: PlanType;
  amount: number; 
}) => {
  const { userId, stripePaymentId, planType, amount } = payload;

  
  const otp = crypto.randomInt(100000, 999999).toString();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); 

  
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.email) throw new Error("User email not found");


  const pendingSubscription = await prisma.subscription.create({
    data: {
      userId,
      stripePaymentId,
      planType,
      amount: new Prisma.Decimal(amount), 
      status: SubscriptionStatus.PENDING, 
      activationOtp: otp,
      otpExpiresAt,
    },
  });

  
  await sendEmail({
    to: user.email,
    subject: "🔐 Activate Your CineTube Premium Plan",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; max-width: 500px;">
        <h2 style="color: #e50914;">Welcome to CineTube Premium!</h2>
        <p>Hi ${user.name || "User"},</p>
        <p>Your payment was successful. Please use the following One-Time Password (OTP) to activate your subscription plan:</p>
        <div style="background: #f4f4f4; padding: 15px; text-align: center; font-size: 28px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; border-radius: 4px;">
          ${otp}
        </div>
        <p style="color: #777; font-size: 12px;">This OTP will expire in 10 minutes. Do not share this code with anyone.</p>
      </div>
    `,
  });

  return {
    subscriptionId: pendingSubscription.id,
    message: "Subscription initialized. An activation OTP has been sent to your email.",
  };
};


const verifySubscriptionOtp = async (userId: string, otp: string) => {
  
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: SubscriptionStatus.PENDING,
    },
    orderBy: { createdAt: "desc" },
  });

  if (!subscription) throw new Error("No pending subscription found for this user.");
  if (subscription.activationOtp !== otp) throw new Error("Invalid OTP code. Please check again.");
  if (new Date() > new Date(subscription.otpExpiresAt!)) throw new Error("OTP has expired. Please request a new checkout.");

  
  const startDate = new Date();
  const endDate = new Date();

  if (subscription.planType === PlanType.MONTHLY) {
    endDate.setMonth(startDate.getMonth() + 1);
  } else if (subscription.planType === PlanType.YEARLY) {
    endDate.setFullYear(startDate.getFullYear() + 1);
  }

  
  const activatedSubscription = await prisma.subscription.update({
    where: { id: subscription.id },
    data: {
      status: SubscriptionStatus.ACTIVE,
      startDate,
      endDate,
      activationOtp: null, 
      otpExpiresAt: null,
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return activatedSubscription;
};


const getMySubscription = async (userId: string) => {
  const currentTime = new Date();

  return await prisma.subscription.findFirst({
    where: {
      userId: userId,
      status: SubscriptionStatus.ACTIVE,
      endDate: {
        gt: currentTime, 
      },
    },
    orderBy: { endDate: "desc" },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });
};

export const subscriptionService = {
  createPendingSubscription,
  verifySubscriptionOtp,
  getMySubscription,
};