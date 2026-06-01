import jwt, { SignOptions } from "jsonwebtoken";
import { envVars } from "../config/env";
import { CookieUtils } from "./cookie";
import { Response } from "express";

const getAccessToken = (payload: any) => {
    return jwt.sign(payload, envVars.ACCESS_TOKEN_SECRET, {
        expiresIn: envVars.ACCESS_TOKEN_EXPIRES_IN,
    } as SignOptions);
};

const getRefreshToken = (payload: any) => {
    return jwt.sign(payload, envVars.REFRESH_TOKEN_SECRET, {
        expiresIn: envVars.REFRESH_TOKEN_EXPIRES_IN,
    } as SignOptions);
};

// =========================
// VERIFY (SAFE VERSION)
// =========================
const verifyAccessToken = (token: string) => {
    try {
        return jwt.verify(token, envVars.ACCESS_TOKEN_SECRET);
    } catch (err: any) {
        if (err.name === "TokenExpiredError") {
            throw new Error("TOKEN_EXPIRED");
        }
        throw new Error("INVALID_TOKEN");
    }
};

const verifyRefreshToken = (token: string) => {
    try {
        return jwt.verify(token, envVars.REFRESH_TOKEN_SECRET);
    } catch (err: any) {
        throw new Error("INVALID_REFRESH_TOKEN");
    }
};

// =========================
// COOKIES
// =========================
const setAccessTokenCookie = (res: Response, token: string) => {
    CookieUtils.setCookie(res, "accessToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: 60 * 60 * 24 * 1000,
    });
};

const setRefreshTokenCookie = (res: Response, token: string) => {
    CookieUtils.setCookie(res, "refreshToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: 60 * 60 * 24 * 1000 * 7,
    });
};

const setBetterAuthSessionCookie = (res: Response, token: string) => {
    CookieUtils.setCookie(res, "better-auth.session_token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: 60 * 60 * 24 * 1000,
    });
};

export const tokenUtils = {
    getAccessToken,
    getRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
    setAccessTokenCookie,
    setRefreshTokenCookie,
    setBetterAuthSessionCookie,
};