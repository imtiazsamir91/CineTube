import { NextFunction, Request, Response } from "express";
import status from "http-status";
import z from "zod";
import { Prisma } from "../../generated/prisma/client";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { 
    handlePrismaClientKnownRequestError, 
    handlePrismaClientValidationError 
} from "../errorHelpers/handlePrismaErrors";
import { handleZodError } from "../errorHelpers/handleZodError";
import { TErrorResponse, TErrorSources } from "../interfaces/error.interface";
import { deleteUploadedFilesFromGlobalErrorHandler } from "../utils/deleteUploadedFilesFromGlobalErrorHandler";

export const globalErrorHandler = async (
    err: any, 
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    await deleteUploadedFilesFromGlobalErrorHandler(req);

    let errorSources: TErrorSources[] = [];
    let statusCode: number = status.INTERNAL_SERVER_ERROR;
    let message: string = 'Internal Server Error';

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        const simplified = handlePrismaClientKnownRequestError(err);
        statusCode = simplified.statusCode as number;
        message = simplified.message;
        errorSources = simplified.errorSources;
    } else if (err instanceof Prisma.PrismaClientValidationError) {
        const simplified = handlePrismaClientValidationError(err);
        statusCode = simplified.statusCode as number;
        message = simplified.message;
        errorSources = simplified.errorSources;
    } else if (err instanceof z.ZodError) {
        const simplified = handleZodError(err);
        statusCode = simplified.statusCode as number;
        message = simplified.message;
        errorSources = simplified.errorSources;
    } else if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
        errorSources = [{ path: '', message: err.message }];
    } else if (err instanceof Error) {
        message = err.message;
        errorSources = [{ path: '', message: err.message }];
    }

    const errorResponse: TErrorResponse = {
        success: false,
        message,
        errorSources,
        error: envVars.NODE_ENV === 'development' ? err : undefined,
        stack: envVars.NODE_ENV === 'development' ? err?.stack : undefined,
    };

    res.status(statusCode).json(errorResponse);
};