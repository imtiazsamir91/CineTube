import { Response } from "express";

interface IResponseData<T> {
    httpStatusCode: number;
    success: boolean;
    data: T;
    message?: string;
    meta?: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }
   
}

export const sendResponse = <T>(res: Response, responseData: IResponseData<T>): void => {
    const { httpStatusCode, success, data, message, meta } = responseData;
    res.status(httpStatusCode).json({
        success,
        data,
        message,
        meta
    });
}