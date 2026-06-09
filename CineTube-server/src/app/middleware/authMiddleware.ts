import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { auth } from "../lib/auth";
import AppError from "../errorHelpers/AppError";
import { tokenUtils } from "../utils/token";

export const authMiddleware =
    (...allowedRoles: ("USER" | "ADMIN")[]) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const sessionToken = req.cookies?.["better-auth.session_token"];
            let accessToken = req.cookies?.accessToken;

            if (!accessToken) {
                const authHeader = req.headers.authorization;
                if (authHeader?.startsWith("Bearer ")) {
                    accessToken = authHeader.split(" ")[1];
                }
            }

            if (!sessionToken && !accessToken) {
                throw new AppError(httpStatus.UNAUTHORIZED, "Authentication required");
            }

            if (sessionToken) {
                try {
                    const session = await auth.api.getSession({
                        headers: new Headers({
                            cookie: `better-auth.session_token=${sessionToken}`,
                        }),
                    });

                    if (session?.user) {
                        const role = (session.user as any).role || "USER";

                        if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
                            throw new AppError(httpStatus.FORBIDDEN, "Access denied");
                        }

                        req.user = {
                            userId: session.user.id,
                            id: session.user.id,
                            email: session.user.email ?? null,
                            role,
                        };

                        return next();
                    }
                } catch (err) {}
            }

            if (accessToken) {
                try {
                    const payload: any = tokenUtils.verifyAccessToken(accessToken);

                    if (!payload?.userId) {
                        throw new Error("Invalid token payload");
                    }

                    const role = payload.role || "USER";

                    if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
                        throw new AppError(httpStatus.FORBIDDEN, "Access denied");
                    }

                    req.user = {
                        userId: payload.userId,
                        id: payload.userId,
                        email: payload.email ?? null,
                        role,
                    };

                    return next();
                } catch (err) {
                    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid or expired access token");
                }
            }

            throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized");
        } catch (error) {
            next(error);
        }
    };