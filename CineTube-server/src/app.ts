import express, { Application, Request, Response } from "express";
import { prisma } from "./app/lib/prisma";
import { indexRouter } from "./app/routes";
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./app/lib/auth";
import path from "path"; 
import { envVars } from "./app/config/env";
import cors from "cors";
import qs from "qs";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";

const app: Application = express();

app.set("query parser", (str: string) => qs.parse(str));
app.set("view engine", "ejs");
app.set("views", path.resolve(process.cwd(), `src/app/templates`));

// ১. CORS কনফিগারেশন
app.use(cors({
    origin: [envVars.FRONTEND_URL, envVars.FRONTEND_URL, "http://localhost:3000"],
    credentials: true, 
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"]
}));

// ২. app.options('*', cors()) লাইনটি এখান থেকে মুছে ফেলা হয়েছে 
// কারণ cors() মিডলওয়্যার অটোমেটিক OPTIONS হ্যান্ডেল করে।

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// ৩. Auth Route
app.all("/api/auth/", (req: Request, res: Response) => {
    return toNodeHandler(auth)(req, res);
});

// ৪. API Routes
app.use('/api/v1', indexRouter);

// ৫. Root Route
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({ success: true, message: "Welcome to CineTube API" });
});

// ৬. গ্লোবাল এরর হ্যান্ডলার
app.use(globalErrorHandler);

export default app;