import { VideoQuality, PricingType } from "../../../generated/prisma/client";

interface MediaFilters {
  search?: string;
  releaseYear?: string;
  videoQuality?: VideoQuality;
  categories?: string;
}

export const buildMediaWhereQuery = (filters: MediaFilters, hasActiveSubscription: boolean) => {
  const { search, releaseYear, videoQuality, categories } = filters;
  const where: any = {};

  
  if (!hasActiveSubscription) {
    where.pricingType = PricingType.FREE;
  }

 
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { director: { contains: search, mode: "insensitive" } },
      { cast: { contains: search, mode: "insensitive" } },
      { synopsis: { contains: search, mode: "insensitive" } },
    ];
  }

 
  if (releaseYear) {
    where.releaseYear = Number(releaseYear);
  }

 
  if (videoQuality) {
    where.videoQuality = videoQuality;
  }


  if (categories) {
    const categoriesArray = categories.split(",").map((cat) => cat.trim());
    where.categories = { hasEvery: categoriesArray };
  }

  return where;
};