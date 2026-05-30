import { PlanType, SubscriptionStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import crypto from "crypto";
import { sendEmail } from "../../utils/email"; 
import { Prisma } from "../../../generated/prisma/client";
import Stripe from "stripe"; 


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16" as any, 
});

const createPendingSubscription = async (payload: {
  userId: string;
  planType: PlanType;
  amount: number; 
}) => {
  const { userId, planType, amount } = payload;


  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.email) throw new Error("User email not found");

 
  const stripeAmount = Math.round(amount * 100); 

  const paymentIntent = await stripe.paymentIntents.create({
    amount: stripeAmount,
    currency: "usd", 
    metadata: {
      userId,
      planType,
    },
  });


  const otp = crypto.randomInt(100000, 999999).toString();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); 

  
  const pendingSubscription = await prisma.subscription.create({
    data: {
      userId,
      stripePaymentId: paymentIntent.id, 
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
    templateName: "subscriptionOtp",
    templateData: {
      name: user.name || "User",
      otp,
    },
  });
  
  return {
    subscriptionId: pendingSubscription.id,
    clientSecret: paymentIntent.client_secret,
    message: "Subscription initialized. Payment Intent generated and Activation OTP sent to email.",
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