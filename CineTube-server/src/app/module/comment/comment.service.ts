import { prisma } from "../../lib/prisma";
import { notificationService } from "../notification/notification.service"; 

enum LocalStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  UNPUBLISHED = "UNPUBLISHED"
}


const createComment = async (payload: {
  reviewId: string;
  userId: string;
  commentText: string;
  parentCommentId?: string; 
}) => {
  const { reviewId, userId, commentText, parentCommentId } = payload;

  
  const commenter = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true }
  });

  let parentComment = null;

  if (parentCommentId) {
    parentComment = await prisma.comment.findUnique({
      where: { id: parentCommentId },
    });
    if (!parentComment) throw new Error("Parent comment not found");
  }


  const newComment = await prisma.comment.create({
    data: {
      reviewId,
      userId,
      commentText,
      parentCommentId,
      status: LocalStatus.APPROVED as any, 
    },
    include: {
      user: {
        select: { id: true, name: true },
      },
    },
  });

  
  if (parentCommentId && parentComment) {
    
    if (parentComment.userId !== userId) {
      await notificationService.createNotification({
        receiverId: parentComment.userId, 
        senderId: userId,                 
        title: "New Reply on Your Comment",
        message: `${commenter?.name || "Someone"} replied: "${commentText.substring(0, 25)}..."`,
        type: "REPLY",
        link: `/movies/${reviewId}`,    
      });
      console.log("🔔 Notification triggered and saved to DB!");
    }
  }

  return newComment;
};


const getReviewCommentsTree = async (reviewId: string) => {
  const allComments = await prisma.comment.findMany({
    where: {
      reviewId,
      status: LocalStatus.APPROVED as any,
    },
    include: {
      user: {
        select: { id: true, name: true },
      },
    },
    orderBy: {
      createdAt: "asc", 
    },
  });

  const commentMap: Record<string, any> = {};
  const rootComments: any[] = [];

  allComments.forEach((comment) => {
    commentMap[comment.id] = { ...comment, replies: [] };
  });

  allComments.forEach((comment) => {
    const mappedComment = commentMap[comment.id];
    if (comment.parentCommentId) {
      if (commentMap[comment.parentCommentId]) {
        commentMap[comment.parentCommentId].replies.push(mappedComment);
      }
    } else {
      rootComments.push(mappedComment);
    }
  });

  return rootComments;
};


const deleteComment = async (userId: string, commentId: string) => {
  const comment = await prisma.comment.findUnique({ where: { id: commentId } });

  if (!comment) throw new Error("Comment not found");
  if (comment.userId !== userId) throw new Error("You are not authorized to delete this comment");

  return await prisma.comment.delete({ where: { id: commentId } });
};


const updateComment = async (userId: string, commentId: string, updatedText: string) => {
  const comment = await prisma.comment.findUnique({ where: { id: commentId } });

  if (!comment) throw new Error("Comment not found");
  if (comment.userId !== userId) throw new Error("You are not authorized to edit this comment");
  
  if ((comment.status as string) === LocalStatus.UNPUBLISHED) {
    throw new Error("Cannot edit an unpublished or hidden comment");
  }

  return await prisma.comment.update({
    where: { id: commentId },
    data: { commentText: updatedText },
    include: {
      user: {
        select: { id: true, name: true }
      }
    }
  });
};


const toggleCommentStatus = async (commentId: string, status: any) => {
  const comment = await prisma.comment.findUnique({ where: { id: commentId } });

  if (!comment) throw new Error("Comment not found");

  return await prisma.comment.update({
    where: { id: commentId },
    data: { status }
  });
};

export const commentService = {
  createComment,
  getReviewCommentsTree,
  deleteComment,
  updateComment,
  toggleCommentStatus,
};