import { Router } from "express";
import { MediaRouter } from "../module/media/media.route";

const router = Router();
router.use("/media", MediaRouter);

export const indexRouter = router;