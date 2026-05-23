import status from "http-status";
import { auth } from "../../lib/auth"; 
import { prisma } from "../../lib/prisma"; 
import AppError from "../../errorHelpers/AppError"; 
import { ISignUpPayload } from "./auth.interface";


const registerUser = async (payload: ISignUpPayload) => {
    const { name, email, password } = payload;

   
    const isUserExists = await prisma.user.findUnique({
        where: { email },
    });

    if (isUserExists) {
        throw new AppError(status.BAD_REQUEST, "এই ইমেইল দিয়ে ইতিপূর্বে অ্যাকাউন্ট তৈরি করা হয়েছে।");
    }

   
    const authResponse = await auth.api.signUpEmail({
        body: {
            name,
            email,
            password,
           
        },
    });

   
    if (!authResponse || !authResponse.user) {
        throw new AppError(status.INTERNAL_SERVER_ERROR, "ইউজার রেজিস্ট্রেশন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।");
    }

    
    const session = await auth.api.signInEmail({
        body: {
            email,
            password,
        }
    });

    
    return {
        user: authResponse.user,
        sessionToken: session.token,
        session,
    };
};

export const AuthService = {
    registerUser,
};