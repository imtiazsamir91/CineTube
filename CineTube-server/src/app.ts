import express, { Application, Request, Response, NextFunction } from "express";
import { prisma } from "./app/lib/prisma";
import { indexRouter } from "./app/routes";
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./app/lib/auth";
import path from "path"; 
import { envVars } from "./app/config/env";
import cors from "cors";
import cron from "node-cron";
import qs from "qs";

const app: Application = express();


app.set("query parser", (str: string) => qs.parse(str));
app.set("view engine", "ejs");
app.set("views", path.resolve(process.cwd(), `src/app/templates`));


app.use(cors({
    origin: [envVars.FRONTEND_URL, envVars.BETTER_AUTH_URL, "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


app.all("/api/auth/*any", (req: Request, res: Response, next: NextFunction) => {
    try {
        return toNodeHandler(auth)(req, res);
    } catch (error: any) {
        console.error("Better Auth Route Error:", error.message);
        res.status(500).json({ success: false, message: "Internal Auth Error" });
    }
});


app.use('/api/v1', indexRouter);


app.get('/', async (req: Request, res: Response) => {
    try {
      
        const media = await prisma.media.create({
            data: {
                title: "Rockstar",
                synopsis: "A passionate musician fights to make it big.",
                releaseYear: 2024
            }
        });
        
        res.status(200).json({
            success: true,
            message: "Welcome to CineTube API",
            data: media
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});


// app.use(globalErrorHandler);
// app.use(notFound);

export default app;