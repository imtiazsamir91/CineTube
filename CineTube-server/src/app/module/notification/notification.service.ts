import { prisma } from "../../lib/prisma";


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


const getUserNotifications = async (userId: string) => {
  return await prisma.notification.findMany({
    where: { receiverId: userId },
    orderBy: { createdAt: "desc" },
    include: {
      
      user: {
        select: { id: true, name: true },
      },
    },
  });
};


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