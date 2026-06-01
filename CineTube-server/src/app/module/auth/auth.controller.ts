import { Request, Response } from "express";
import status from "http-status";

import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import AppError from "../../errorHelpers/AppError";

import { tokenUtils } from "../../utils/token";
import { CookieUtils } from "../../utils/cookie";
import { AuthService } from "./auth.service";

const registerUser = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.registerUser(req.body);

    const {
        accessToken,
        refreshToken,
        sessionToken,
        user,
    } = result;

    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, refreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, sessionToken);

    sendResponse(res, {
        httpStatusCode: status.CREATED,
        success: true,
        message: "User registered successfully",
        data: {
            user,
            accessToken,
            refreshToken,
            sessionToken,
        },
    });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.loginUser(req.body);

    const {
        accessToken,
        refreshToken,
        sessionToken,
        user,
    } = result;

    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, refreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, sessionToken);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "User logged in successfully",
        data: {
            user,
            accessToken,
            refreshToken,
            sessionToken,
        },
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

const getNewToken = catchAsync(async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken;

    const betterAuthSessionToken =
        req.cookies?.["better-auth.session_token"];

    if (!refreshToken) {
        throw new AppError(
            status.UNAUTHORIZED,
            "Refresh token not found"
        );
    }

    const result = await AuthService.getNewAccessToken(refreshToken);
    
    tokenUtils.setAccessTokenCookie(
        res,
        result.accessToken
    );

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "New access token generated successfully",
        data: result,
    });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
    const betterAuthSessionToken =
        req.cookies?.["better-auth.session_token"];

    if (!betterAuthSessionToken) {
        throw new AppError(
            status.UNAUTHORIZED,
            "Session token not found"
        );
    }

    const result = await AuthService.changePassword(
        req.body,
        betterAuthSessionToken
    );

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Password changed successfully",
        data: result,
    });
});

const logoutUser = catchAsync(async (req: Request, res: Response) => {
    const betterAuthSessionToken =
        req.cookies?.["better-auth.session_token"];

    await AuthService.logoutUser(
        betterAuthSessionToken
    );

    CookieUtils.clearCookie(res, "accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });

    CookieUtils.clearCookie(res, "refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });

    CookieUtils.clearCookie(
        res,
        "better-auth.session_token",
        {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        }
    );

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Logout successful",
        data: null,
    });
});

export const AuthController = {
    registerUser,
    loginUser,
    getMe,
    getNewToken,
    changePassword,
    logoutUser,
};