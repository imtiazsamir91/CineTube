import { prisma } from "../../lib/prisma";

// ১. নতুন নোটিফিকেশন ডাটাবেজে সেভ করা (এটি অন্যান্য সার্ভিস থেকে কল হবে)
const createNotification = async (payload: {
  receiverId: string;
  senderId?: string;
  title: string;
  message: string;
  type: string;
  link?: string;
}) => {
  return await prisma.notification.create({
    data: payload,
  });
};

// ২. নির্দিষ্ট ইউজারের সব নোটিফিকেশন তুলে আনা (সর্বশেষগুলো আগে আসবে)
const getUserNotifications = async (userId: string) => {
  return await prisma.notification.findMany({
    where: { receiverId: userId },
    orderBy: { createdAt: "desc" },
    include: {
      // যদি নোটিফিকেশন কোনো নির্দিষ্ট ইউজারের অ্যাকশনের কারণে হয় (যেমন কেউ রিপ্লাই দিলে তার নাম/প্রোফাইল দেখতে চাওয়া)
      user: {
        select: { id: true, name: true },
      },
    },
  });
};

// ৩. নোটিফিকেশন 'Read' বা পঠিত হিসেবে মার্ক করা
const markAsRead = async (userId: string, notificationId: string) => {
  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
  });

  if (!notification) throw new Error("Notification not found");
  if (notification.receiverId !== userId) {
    throw new Error("You are not authorized to update this notification");
  }

  return await prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });
};

export const notificationService = {
  createNotification,
  getUserNotifications,
  markAsRead,
};