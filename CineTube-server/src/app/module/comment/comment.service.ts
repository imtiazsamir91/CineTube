import { prisma } from "../../lib/prisma";


const createComment = async (payload: {
  reviewId: string;
  userId: string;
  commentText: string;
  parentCommentId?: string; 
}) => {
  const { reviewId, userId, commentText, parentCommentId } = payload;

 
  if (parentCommentId) {
    const parentComment = await prisma.comment.findUnique({
      where: { id: parentCommentId },
    });
    if (!parentComment) throw new Error("Parent comment not found");
  }

  return await prisma.comment.create({
    data: {
      reviewId,
      userId,
      commentText,
      parentCommentId,
      status: "APPROVED", 
    },
    include: {
      user: {
        select: { id: true, name: true },
      },
    },
  });
};


const getReviewCommentsTree = async (reviewId: string) => {
  
  const allComments = await prisma.comment.findMany({
    where: {
      reviewId,
      status: "APPROVED",
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

export const commentService = {
  createComment,
  getReviewCommentsTree,
  deleteComment,
};