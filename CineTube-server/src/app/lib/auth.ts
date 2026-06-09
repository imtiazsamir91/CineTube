import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { bearer, emailOTP } from "better-auth/plugins";
import { Role } from "../../generated/prisma/enums"; // আপনার এনাম পাথ অনুযায়ী পরিবর্তন করে নেবেন
import { envVars } from "../config/env";
//import { sendEmail } from "../utils/email";
import { prisma } from "./prisma";

export const auth = betterAuth({
    baseURL: envVars.BETTER_AUTH_URL,
    secret: envVars.BETTER_AUTH_SECRET,
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),

    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false, // পেমেন্টের পর ওটিপি ভেরিফিকেশন হবে
    },

    // socialProviders: {
    //     google: {
    //         //clientId: envVars.GOOGLE_CLIENT_ID,
    //         //clientSecret: envVars.GOOGLE_CLIENT_SECRET,
    //         mapProfileToUser: (profile) => {
    //             // ⚡ ফিক্স ১ ও ২: ওঅথ প্রোফাইলের সঠিক টাইপ প্রপার্টি ব্যবহার করা হয়েছে
    //             return {
    //                 name: profile.name || "CineTube User",
    //                 email: profile.email,

    
    //                 image: profile.picture || undefined, 
    //             };
    //         }
    //     }
    // },

    emailVerification: {
        sendOnSignUp: false,
        sendOnSignIn: false,
        autoSignInAfterVerification: true,
    },

    plugins: [
        bearer(),
        // emailOTP({
        //     overrideDefaultEmailVerification: true,
        //     async sendVerificationOTP({ email, otp, type }) {
        //         // ⚡ ফিক্স ৩: স্কিমা অনুযায়ী 'subscriptions' (বহুবচন) রিলেশন লোড করা হয়েছে
        //         const user = await prisma.user.findUnique({
        //             where: { email },
        //             include: { 
        //                 subscriptions: {
        //                     // cast to any to avoid strict prisma orderBy type issues for the createdAt field
        //                     orderBy: { createdAt: 'desc' } as any, // সবচেয়ে লেটেস্ট সাবস্ক্রিপশনটি আগে আসবে
        //                     take: 1 // শুধুমাত্র ১টি রেকর্ড নিব
        //                 }
        //             }
        //         });

        //         if (!user) {
        //             console.error(`User with email ${email} not found.`);
        //             return;
        //         }

        //         // ⚡ ফিক্স ৪: লেটেস্ট সাবস্ক্রিপশন অবজেক্টটি বের করে ভ্যালিডেশন চেক
        //         const latestSubscription = user.subscriptions?.[0] || null;

        //         const hasActiveSubscription = 
        //             latestSubscription && 
        //             latestSubscription.status === "ACTIVE" && 
        //             new Date(latestSubscription.endDate) > new Date();

        //         if (type === "email-verification") {
        //             // সাবস্ক্রিপশন না থাকলে বা মেয়াদ শেষ হলে ওটিপি ব্লক হবে
        //             if (!hasActiveSubscription) {
        //                 console.log(`User ${email} does not have an active subscription. OTP blocked.`);
        //                 return; 
        //             }

        //             await sendEmail({
        //                 to: email,
        //                 subject: "Your CineTube Premium Activation OTP",
        //                 templateName: "otp",
        //                 templateData: {
        //                     name: user.name,
        //                     otp,
        //                 }
        //             });
        //         } else if (type === "forget-password") {
        //             await sendEmail({
        //                 to: email,
        //                 subject: "Reset your CineTube Password",
        //                 templateName: "otp",
        //                 templateData: {
        //                     name: user.name,
        //                     otp,
        //                 }
        //             });
        //         }
        //     },
        //     expiresIn: 5 * 60, 
        //     otpLength: 6,
        // }
        // ),
    ],

    session: {
        expiresIn: 60 * 60 * 24, 
        updateAge: 60 * 60 * 24, 
        cookieCache: {
            enabled: true,
            maxAge: 60 * 60 * 24, 
        }
    },

    redirectURLs: {
        signIn: `${envVars.BETTER_AUTH_URL}/api/v1/auth/google/success`,
    },

    trustedOrigins: [process.env.BETTER_AUTH_URL || "http://localhost:5000", envVars.FRONTEND_URL],

    advanced: {
        useSecureCookies: false,
        cookies: {
            state: { attributes: { sameSite: "none", secure: true, httpOnly: true, path: "/" } },
            sessionToken: { attributes: { sameSite: "none", secure: true, httpOnly: true, path: "/" } }
        }
    }
});