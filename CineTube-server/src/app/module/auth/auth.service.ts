import status from "http-status";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import AppError from "../../errorHelpers/AppError";
import { ILoginUserPayload, ISignUpPayload } from "./auth.interface";
import { tokenUtils } from "../../utils/token";

/* =========================
   REGISTER USER
========================= */
const registerUser = async (payload: ISignUpPayload) => {
    const { name, email, password } = payload;

    const isUserExists = await prisma.user.findUnique({
        where: { email },
    });

    if (isUserExists) {
        throw new AppError(
            status.BAD_REQUEST,
            "Email already in use"
        );
    }

    const authResponse = await auth.api.signUpEmail({
        body: { name, email, password },
    });

    if (!authResponse?.user) {
        throw new AppError(
            status.INTERNAL_SERVER_ERROR,
            "Registration failed"
        );
    }

    const sessionResponse = await auth.api.signInEmail({
        body: { email, password },
    });

    const role =
        (authResponse.user as any).role || "USER";

    const accessToken = tokenUtils.getAccessToken({
        userId: authResponse.user.id,
        email: authResponse.user.email,
        name: authResponse.user.name,
        role,
    });

    const refreshToken = tokenUtils.getRefreshToken({
        userId: authResponse.user.id,
        email: authResponse.user.email,
        name: authResponse.user.name,
        role,
    });

    return {
        user: authResponse.user,
        sessionToken: sessionResponse.token,
        accessToken,
        refreshToken,
    };
};

/* =========================
   LOGIN USER
========================= */
const loginUser = async (payload: ILoginUserPayload) => {
    const { email, password } = payload;

    const authResponse = await auth.api.signInEmail({
        body: { email, password },
    });

    if (!authResponse?.user) {
        throw new AppError(status.UNAUTHORIZED, "Invalid credentials");
    }

    // পুরো ইউজার অবজেক্টটি নিয়ে চেক করুন
    const userFromDb = await prisma.user.findUnique({
        where: { id: authResponse.user.id }
    });

    // রোলটি এখানে সরাসরি Enum ভ্যালু হিসেবে পাওয়ার কথা
    const role = userFromDb?.role || "USER"; 

    console.log("Found Role in DB:", role); // ডিবাগ করার জন্য

    const accessToken = tokenUtils.getAccessToken({
        userId: authResponse.user.id,
        email: authResponse.user.email,
        name: authResponse.user.name,
        role: role as string, // Enum কে string এ কনভার্ট করুন
    });

    const refreshToken = tokenUtils.getRefreshToken({
        userId: authResponse.user.id,
        email: authResponse.user.email,
        name: authResponse.user.name,
        role: role as string,
    });

    return {
        user: authResponse.user,
        sessionToken: authResponse.token,
        accessToken,
        refreshToken,
    };
};

/* =========================
   GET ME
========================= */
const getMe = async (user: any) => {
    if (!user) {
        throw new AppError(status.UNAUTHORIZED, "User not found");
    }

    return {
        id: user.id,
        userId: user.userId,
        email: user.email,
        role: user.role,
    };
};

/* =========================
   REFRESH TOKEN
========================= */
const getNewAccessToken = async (refreshToken: string) => {
    if (!refreshToken) {
        throw new AppError(status.UNAUTHORIZED, "Refresh token missing");
    }

    let decoded: any;

    try {
        decoded = tokenUtils.verifyRefreshToken(refreshToken);
    } catch {
        throw new AppError(status.UNAUTHORIZED, "Invalid refresh token");
    }

    if (!decoded?.userId) {
        throw new AppError(status.UNAUTHORIZED, "Invalid refresh token payload");
    }

    // optional: verify user exists
    const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
    });

    if (!user) {
        throw new AppError(status.UNAUTHORIZED, "User not found");
    }

    const accessToken = tokenUtils.getAccessToken({
        userId: user.id,
        email: user.email,
        role: (user as any).role || "USER",
    });

    return {
        accessToken,
    };
};

/* =========================
   CHANGE PASSWORD
========================= */
const changePassword = async (
    payload: { oldPassword: string; newPassword: string },
    betterAuthSessionToken: string
) => {
    const session = await prisma.session.findFirst({
        where: {
            token: betterAuthSessionToken,
        },
        include: {
            user: true,
        },
    });

    if (!session) {
        throw new AppError(
            status.UNAUTHORIZED,
            "Session expired"
        );
    }

    await auth.api.changePassword({
        body: {
            currentPassword: payload.oldPassword,
            newPassword: payload.newPassword,
            revokeOtherSessions: true,
        },
        headers: {
            cookie: `better-auth.session_token=${betterAuthSessionToken}`,
        },
    });

    return {
        success: true,
        message: "Password changed successfully",
    };
};

/* =========================
   LOGOUT
========================= */
const logoutUser = async (betterAuthSessionToken: string) => {
    if (!betterAuthSessionToken) {
        throw new AppError(
            status.UNAUTHORIZED,
            "Session token missing"
        );
    }

    await prisma.session.deleteMany({
        where: {
            token: betterAuthSessionToken,
        },
    });

    return {
        success: true,
        message: "Logged out successfully",
    };
};

export const AuthService = {
    registerUser,
    loginUser,
    getMe,
    getNewAccessToken,
    changePassword,
    logoutUser,
};