import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import AppError from "../../errorHelpers/AppError";
import { tokenUtils } from "../../utils/token";
import { CookieUtils } from "../../utils/cookie";
import { envVars } from "../../config/env";
import { auth } from "../../lib/auth";
import { AuthService } from "./auth.service"; 

const registerUser = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;

    const result = await AuthService.registerUser(payload);
    const { accessToken, refreshToken, sessionToken, user } = result;

   
    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, refreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, sessionToken);

    sendResponse(res, {
        httpStatusCode: status.CREATED,
        success: true,
        message: "User registered successfully",
        data: {
            sessionToken,
            accessToken,
            refreshToken,
            user,
        }
    });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;

    const result = await AuthService.loginUser(payload);
    const { accessToken, refreshToken, sessionToken, user } = result;

    // 🎯 লগইনের সময়ও কুকি সেট করা হলো
    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, refreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, sessionToken);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "User logged in successfully",
        data: {
            sessionToken,
            accessToken,
            refreshToken,
            user,
        }
    });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
    const user = req.user; 
    const result = await AuthService.getMe(user);
    
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "User profile retrieved successfully",
        data: result,
    });
});

// const getNewToken = catchAsync(async (req: Request, res: Response) => {
//     const refreshToken = req.cookies.refreshToken;
//     const betterAuthSessionToken = req.cookies["better-auth.session_token"];
    
//     if (!refreshToken) {
//         throw new AppError(status.UNAUTHORIZED, "রिफ্রেশ টোকেন পাওয়া যায়নি!");
//     }
    
//     const result = await AuthService.getNewToken(refreshToken, betterAuthSessionToken);
//     const { accessToken, refreshToken: newRefreshToken, sessionToken } = result;

//     tokenUtils.setAccessTokenCookie(res, accessToken);
//     tokenUtils.setRefreshTokenCookie(res, newRefreshToken);
//     tokenUtils.setBetterAuthSessionCookie(res, sessionToken);

//     sendResponse(res, {
//         httpStatusCode: status.OK,
//         success: true,
//         message: "নতুন টোকেন সফলভাবে জেনারেট করা হয়েছে",
//         data: {
//             accessToken,
//             refreshToken: newRefreshToken,
//             sessionToken,
//         },
//     });
// });

// const changePassword = catchAsync(async (req: Request, res: Response) => {
//     const payload = req.body;
//     const betterAuthSessionToken = req.cookies["better-auth.session_token"];

//     const result = await AuthService.changePassword(payload, betterAuthSessionToken);
//     const { accessToken, refreshToken, token } = result;

//     tokenUtils.setAccessTokenCookie(res, accessToken);
//     tokenUtils.setRefreshTokenCookie(res, refreshToken);
//     tokenUtils.setBetterAuthSessionCookie(res, token as string);

//     sendResponse(res, {
//         httpStatusCode: status.OK,
//         success: true,
//         message: "পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে",
//         data: result,
//     });
// });

// const logoutUser = catchAsync(async (req: Request, res: Response) => {
//     const betterAuthSessionToken = req.cookies["better-auth.session_token"];
//     const result = await AuthService.logoutUser(betterAuthSessionToken);
    
//     // 🎯 লগআউটের সময় কুকিগুলো ক্লিয়ার করা
//     CookieUtils.clearCookie(res, 'accessToken', { httpOnly: true, secure: true, sameSite: "none" });
//     CookieUtils.clearCookie(res, 'refreshToken', { httpOnly: true, secure: true, sameSite: "none" });
//     CookieUtils.clearCookie(res, 'better-auth.session_token', { httpOnly: true, secure: true, sameSite: "none" });

//     sendResponse(res, {
//         httpStatusCode: status.OK,
//         success: true,
//         message: "সফলভাবে লগআউট করা হয়েছে",
//         data: result,
//     });
// });

// const verifyEmail = catchAsync(async (req: Request, res: Response) => {
//     const { email, otp } = req.body;
//     await AuthService.verifyEmail(email, otp);

//     sendResponse(res, {
//         httpStatusCode: status.OK,
//         success: true,
//         message: "ইমেইল সফলভাবে ভেরিফাই করা হয়েছে",
//         data: null,
//     });
// });

// const forgetPassword = catchAsync(async (req: Request, res: Response) => {
//     const { email } = req.body;
//     await AuthService.forgetPassword(email);

//     sendResponse(res, {
//         httpStatusCode: status.OK,
//         success: true,
//         message: "পাসওয়ার্ড রিসেট OTP ইমেইলে পাঠানো হয়েছে",
//         data: null,
//     });
// });

// const resetPassword = catchAsync(async (req: Request, res: Response) => {
//     const { email, otp, newPassword } = req.body;
//     await AuthService.resetPassword(email, otp, newPassword);

//     sendResponse(res, {
//         httpStatusCode: status.OK,
//         success: true,
//         message: "পাসওয়ার্ড সফলভাবে রিসেট করা হয়েছে",
//         data: null,
//     });
// });

// const googleLogin = catchAsync((req: Request, res: Response) => {
//     const redirectPath = req.query.redirect || "/dashboard";
//     const encodedRedirectPath = encodeURIComponent(redirectPath as string);
//     const callbackURL = `${envVars.BETTER_AUTH_URL}/api/v1/auth/google/success?redirect=${encodedRedirectPath}`;

//     res.render("googleRedirect", {
//         callbackURL: callbackURL,
//         betterAuthUrl: envVars.BETTER_AUTH_URL,
//     });
// });

// const googleLoginSuccess = catchAsync(async (req: Request, res: Response) => {
//     const redirectPath = req.query.redirect as string || "/dashboard";
//     const sessionToken = req.cookies["better-auth.session_token"];

//     if (!sessionToken) {
//         return res.redirect(`${envVars.FRONTEND_URL}/login?error=oauth_failed`);
//     }

//     const session = await auth.api.getSession({
//         headers: {
//             "Cookie": `better-auth.session_token=${sessionToken}`
//         }
//     });

//     if (!session || !session.user) {
//         return res.redirect(`${envVars.FRONTEND_URL}/login?error=no_session_or_user_found`);
//     }

//     const result = await AuthService.googleLoginSuccess(session);
//     const { accessToken, refreshToken } = result;

//     tokenUtils.setAccessTokenCookie(res, accessToken);
//     tokenUtils.setRefreshTokenCookie(res, refreshToken);

//     const isValidRedirectPath = redirectPath.startsWith("/") && !redirectPath.startsWith("//");
//     const finalRedirectPath = isValidRedirectPath ? redirectPath : "/dashboard";

//     res.redirect(`${envVars.FRONTEND_URL}${finalRedirectPath}`);
// });

// const handleOAuthError = catchAsync((req: Request, res: Response) => {
//     const error = req.query.error as string || "oauth_failed";
//     res.redirect(`${envVars.FRONTEND_URL}/login?error=${error}`);
// });

export const AuthController = {
    registerUser, // 👈 ফাংশনের নাম আপডেট করা হয়েছে
    loginUser,
    getMe,
    // getNewToken,
    // changePassword,
    // logoutUser,
    // verifyEmail,
    // forgetPassword,
    // resetPassword,
    // googleLogin,
    // googleLoginSuccess,
    // handleOAuthError,
};