import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { auth } from "../lib/auth";
import AppError from "../errorHelpers/AppError";
import { tokenUtils } from "../utils/token";

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                id: string;
                email?: string | null;
                role: "USER" | "ADMIN";
            };
        }
    }
}

export const authMiddleware =
    (...allowedRoles: ("USER" | "ADMIN")[]) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const sessionToken =
                req.cookies?.["better-auth.session_token"];
            const accessToken = req.cookies?.accessToken;

            // =========================
            // NO TOKEN
            // =========================
            if (!sessionToken && !accessToken) {
                throw new AppError(
                    httpStatus.UNAUTHORIZED,
                    "Authentication required"
                );
            }

            // =========================
            // 1. BETTER AUTH
            // =========================
            if (sessionToken) {
                try {
                    const session = await auth.api.getSession({
                        headers: new Headers({
                            cookie: `better-auth.session_token=${sessionToken}`,
                        }),
                    });

                    if (session?.user) {
                        const role =
                            (session.user as any).role || "USER";

                        req.user = {
                            userId: session.user.id,
                            id: session.user.id,
                            email: session.user.email ?? null,
                            role,
                        };

                        return next();
                    }
                } catch {
                    // fallback to JWT
                }
            }

            // =========================
            // 2. JWT FALLBACK
            // =========================
            if (accessToken) {
                try {
                    const decoded =
                        tokenUtils.verifyAccessToken(accessToken);

                    const payload: any = decoded;

                    if (!payload?.userId) {
                        throw new Error("Invalid token");
                    }

                    req.user = {
                        userId: payload.userId,
                        id: payload.userId,
                        email: payload.email ?? null,
                        role: payload.role || "USER",
                    };

                    return next();
                } catch {
                    throw new AppError(
                        httpStatus.UNAUTHORIZED,
                        "Invalid or expired access token"
                    );
                }
            }

            throw new AppError(
                httpStatus.UNAUTHORIZED,
                "Unauthorized"
            );
        } catch (error) {
            next(error);
        }
    };