import { PlanType } from "../../../generated/prisma/enums";



const createSubscription = async (payload: {
  userId: string;
  stripePaymentId: string;
  planType: PlanType;
  amount: number;
}) => {
  const { userId, stripePaymentId, planType, amount } = payload;
  
  const startDate = new Date();
  const endDate = new Date();

  
  if (planType === PlanType.MONTHLY) {
    endDate.setMonth(startDate.getMonth() + 1);
  } else if (planType === PlanType.YEARLY) {
    endDate.setFullYear(startDate.getFullYear() + 1);
  }
  return {
    userId,
    stripePaymentId,
    planType,
    amount,
    startDate,
    endDate,
  };
};

export const subscriptionService = {
  createSubscription,
};