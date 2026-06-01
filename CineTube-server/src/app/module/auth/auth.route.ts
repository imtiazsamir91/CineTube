import { Router } from "express";
import { AuthController } from "./auth.controller";
import { authMiddleware } from "../../middleware/authMiddleware";
// import { authMiddleware } from "../../middlewares/authMiddleware";

const router = Router();

// Public routes
router.post("/register", AuthController.registerUser);
router.post("/login", AuthController.loginUser);

// Protected routes
router.get("/me", authMiddleware(), AuthController.getMe);

router.post("/refresh-token", AuthController.getNewToken);

router.post(
    "/change-password",
    authMiddleware(),
    AuthController.changePassword
);

router.post(
    "/logout",
    authMiddleware(),
    AuthController.logoutUser
);

export const AuthRoutes = router;