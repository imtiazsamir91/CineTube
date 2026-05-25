import { Router } from "express";
import { MediaRouter } from "../module/media/media.route";
import { AuthRoutes } from "../module/auth/auth.route";
import { WatchlistRoutes } from "../module/watchlist/watchlist.route";
import { watchHistoryRoutes } from "../module/watchHistory/history.route";
import { subscriptionRoutes } from "../module/subscription/subscription.route";
import { reviewRoutes } from "../module/review/review.routes";

const router = Router();
router.use("/auth", AuthRoutes);
router.use("/media", MediaRouter);
router.use("/watchlist", WatchlistRoutes);
router.use("/watch-history", watchHistoryRoutes);
router.use("/subscription", subscriptionRoutes);
router.use("/review", reviewRoutes);



export const indexRouter = router;