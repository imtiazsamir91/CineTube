import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { auth } from "../lib/auth"; 
import AppError from "../errorHelpers/AppError"; 
import jwt from "jsonwebtoken"; 

// ১. গ্লোবাল টাইপে 'role' ফিল্ডটি যুক্ত করা হলো
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                id: string;
                email?: string | null;
                role: "USER" | "ADMIN"; // 🎯 রোল টাইপ ডিফাইন করা হলো
            };
        }
    }
}

// ২. মিডলওয়্যারকে ডাইনামিক করা হলো যাতে কল করার সময় রোল পাস করা যায় (যেমন: authMiddleware("ADMIN"))
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

            // --- Better-Auth Session Verification ---
            if (sessionToken) {
                const session = await auth.api.getSession({
                    headers: new Headers({
                        "cookie": `better-auth.session_token=${sessionToken}`
                    }),
                });

                // 🎯 Better-Auth থেকে আসা ইউজারের রোলটি (session.user.role) এখানে নেওয়া হয়েছে
                if (session && session.user) {
                    console.log("Better-Auth Session Verified: 🎉 Success!");
                    req.user = {
                        userId: session.user.id,
                        id: session.user.id,
                        email: session.user.email,
                        role: (session.user as any).role || "USER", // 🎯 রোল অ্যাসাইন হলো
                    };

                    // রোল ভ্যালিডেশন চেক
                    if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
                        throw new AppError(httpStatus.FORBIDDEN, "Forbidden access! You do not have permission.");
                    }

                    return next();
                }
            }

            // --- Custom Access Token (Backup) Verification ---
            if (accessToken) {
                const decoded = jwt.decode(accessToken) as any;
                
                // 🎯 টোকেনের ডিকোডেড ডেটা থেকেও রোল নেওয়া হচ্ছে
                if (decoded && decoded.userId) {
                    console.log("Custom Access Token Verified: 🚀 Backup Success!");
                    req.user = {
                        userId: decoded.userId,
                        id: decoded.userId,
                        email: decoded.email,
                        role: decoded.role || "USER", // 🎯 রোল অ্যাসাইন হলো
                    };

                    // রোল ভ্যালিডেশন চেক
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