import express from "express";
import { WatchlistController } from "./watchlist.controller";
import { authMiddleware } from "../../middleware/authMiddleware"; // আপনার সঠিক মিডলওয়্যার পাথটি দিন

const router = express.Router();


router.use(authMiddleware());

router.post("/", WatchlistController.addToWatchlist); 
router.get("/", WatchlistController.getMyWatchlist);   


router.delete("/:mediaId", WatchlistController.removeFromWatchlist); 

export const WatchlistRoutes = router;