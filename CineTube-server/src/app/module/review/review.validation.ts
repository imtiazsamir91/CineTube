import { z } from "zod";

const createReviewValidationSchema = z.object({
  body: z.object({
    
    mediaId: z
      .string()
      .min(1, { message: "Media ID is required" }),
    
    rating: z
      .number()
      .min(1, { message: "Rating must be at least 1" })
      .max(10, { message: "Rating cannot be more than 10" }),
      
    reviewText: z
      .string()
      .min(10, { message: "Review must be at least 10 characters long" }),
      
    isSpoiler: z.boolean().optional(),
    tags: z.string().optional(),
  }),
});

export const reviewValidation = {
  createReviewValidationSchema,
};