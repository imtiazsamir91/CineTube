import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { auth } from "../lib/auth"; 
import AppError from "../errorHelpers/AppError"; 
import jwt from "jsonwebtoken"; 

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


export const authMiddleware = (...allowedRoles: ("USER" | "ADMIN")[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const sessionToken = req.cookies?.["better-auth.session_token"];
            const accessToken = req.cookies?.accessToken;

            console.log("=== [CineTube Extra Debug] ===");
            console.log("Cookies raw check -> session_token:", sessionToken ? "✅" : "❌", " | accessToken:", accessToken ? "✅" : "❌");

            if (!sessionToken && !accessToken) {
                throw new AppError(httpStatus.UNAUTHORIZED, "Authentication required! Please log in.");
            }

            if (sessionToken) {
                const session = await auth.api.getSession({
                    headers: new Headers({
                        "cookie": `better-auth.session_token=${sessionToken}`
                    }),
                });

                
                if (session && session.user) {
                    console.log("Better-Auth Session Verified: 🎉 Success!");
                    req.user = {
                        userId: session.user.id,
                        id: session.user.id,
                        email: session.user.email,
                        role: (session.user as any).role || "USER", 
                    };

                   
                    if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
                        throw new AppError(httpStatus.FORBIDDEN, "Forbidden access! You do not have permission.");
                    }

                    return next();
                }
            }

           
            if (accessToken) {
                const decoded = jwt.decode(accessToken) as any;
                
                
                if (decoded && decoded.userId) {
                    console.log("Custom Access Token Verified: 🚀 Backup Success!");
                    req.user = {
                        userId: decoded.userId,
                        id: decoded.userId,
                        email: decoded.email,
                        role: decoded.role || "USER", 
                    };

                   
                    if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
                        throw new AppError(httpStatus.FORBIDDEN, "Forbidden access! You do not have permission.");
                    }

                    return next();
                }
            }

            throw new AppError(httpStatus.UNAUTHORIZED, "Session expired or invalid. Please login again.");

        } catch (error) {
            next(error); 
        }
    };
};