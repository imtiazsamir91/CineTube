import { Router } from "express";
import { MediaRouter } from "../module/media/media.route";
import { AuthRoutes } from "../module/auth/auth.route";
import { WatchlistRoutes } from "../module/watchlist/watchlist.route";

const router = Router();
router.use("/auth", AuthRoutes);
router.use("/media", MediaRouter);
router.use("/watchlist", WatchlistRoutes);


export const indexRouter = router;