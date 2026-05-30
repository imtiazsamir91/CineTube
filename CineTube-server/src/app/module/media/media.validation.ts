import { z } from "zod";
import { PricingType, VideoQuality } from "../../../generated/prisma/client";

const createMediaValidationSchema = z.object({
  body: z.object({
   
    title: z.string("Title is required"),
    synopsis: z.string("Synopsis is required"),
    
   
    releaseYear: z.coerce.number("Release year is required"),
    duration: z.coerce.number().optional().default(0),
    
    director: z.string().optional(),
    cast: z.string().optional(),
    streamingPlatforms: z.string().optional(),
    
    pricingType: z.nativeEnum(PricingType).optional().default(PricingType.FREE),
    videoQuality: z.nativeEnum(VideoQuality).optional().default(VideoQuality.FHD),
    
    categories: z.preprocess((val) => {
      if (typeof val === "string") {
        try { 
          return JSON.parse(val); 
        } catch { 
          return val.split(",").map(c => c.trim()); 
        }
      }
      return val;
    }, z.array(z.string())).optional().default([]),
  }),
});

export const MediaValidation = {
  createMediaValidationSchema,
};