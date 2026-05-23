import { Router } from "express";
import { MediaRouter } from "../module/media/media.route";
import { AuthRoutes } from "../module/auth/auth.route";

const router = Router();
router.use("/auth", AuthRoutes);
router.use("/media", MediaRouter);


export const indexRouter = router;