import status from "http-status";
import { auth } from "../../lib/auth"; 
import { prisma } from "../../lib/prisma"; 
import AppError from "../../errorHelpers/AppError"; 
import { ILoginUserPayload, ISignUpPayload } from "./auth.interface";
import { tokenUtils } from "../../utils/token"; 
import { get } from "node:http";

const registerUser = async (payload: ISignUpPayload) => {
    const { name, email, password } = payload;

    const isUserExists = await prisma.user.findUnique({
        where: { email },
    });

    if (isUserExists) {
        throw new AppError(status.BAD_REQUEST, "Email already in use. Please use a different email.");
    }

    const authResponse = await auth.api.signUpEmail({
        body: { name, email, password },
    });

    if (!authResponse || !authResponse.user) {
        throw new AppError(status.INTERNAL_SERVER_ERROR, "User registration failed. Please try again.");
    }

   
    const sessionResponse = await auth.api.signInEmail({
        body: { email, password }
    });

    const userRole = "role" in authResponse.user ? authResponse.user.role : "user";

   
    const accessToken = tokenUtils.getAccessToken({
        userId: authResponse.user.id,
        role: userRole,
        name: authResponse.user.name,
        email: authResponse.user.email,
    });

    const refreshToken = tokenUtils.getRefreshToken({
        userId: authResponse.user.id,
        role: userRole,
        name: authResponse.user.name,
        email: authResponse.user.email,
    });

    return {
        user: authResponse.user,
        sessionToken: sessionResponse.token, 
        accessToken,
        refreshToken
    };
};

const loginUser = async (payload: ILoginUserPayload) => {
    const { email, password } = payload;
    
    const authResponse = await auth.api.signInEmail({
        body: { email, password },
    });

    if (!authResponse || !authResponse.user) {
        throw new AppError(status.UNAUTHORIZED, "Invalid email or password");
    }

 
    const userRole = "role" in authResponse.user ? authResponse.user.role : "user";

    const accessToken = tokenUtils.getAccessToken({
        userId: authResponse.user.id,
        role: userRole,
        name: authResponse.user.name,
        email: authResponse.user.email,
    });

    const refreshToken = tokenUtils.getRefreshToken({
        userId: authResponse.user.id,
        role: userRole,
        name: authResponse.user.name,
        email: authResponse.user.email,
    });

    return {
        user: authResponse.user,
        sessionToken: authResponse.token, 
        accessToken,
        refreshToken
    };
};
 const getMe = async (user: any) => {

    return user;
};
const getNewToken = async (refreshToken: string, betterAuthSessionToken: string) => {
    
   }
   const changePassword = async (payload: { oldPassword: string; newPassword: string }, betterAuthSessionToken: string) => {
    
   }


export const AuthService = {
    registerUser,
    loginUser,
    getMe,
    getNewToken,
    changePassword
};