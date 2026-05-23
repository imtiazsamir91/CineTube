/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request } from "express";
import fs from "fs"; 

export const deleteUploadedFilesFromGlobalErrorHandler = async (req: Request) => {
    try {
        const filesToDelete: string[] = [];

        
        if ((req as any).file && (req as any).file.path) {
            filesToDelete.push((req as any).file.path);
        } 
        
        else if ((req as any).files && typeof (req as any).files === 'object' && !Array.isArray((req as any).files)) {
            Object.values((req as any).files).forEach((fileArray: any) => {
                if (Array.isArray(fileArray)) {
                    fileArray.forEach((file: any) => {
                        if (file.path) {
                            filesToDelete.push(file.path);
                        }
                    });
                }
            });
        } 
       
        else if ((req as any).files && Array.isArray((req as any).files) && (req as any).files.length > 0) {
            (req as any).files.forEach((file: any) => {
                if (file.path) {
                    filesToDelete.push(file.path);
                }
            });
        }

        
        if (filesToDelete.length > 0) {
            filesToDelete.forEach(filePath => {
               
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath); 
                }
            });

            console.log(`\nDeleted ${filesToDelete.length} uploaded local file(s) due to an error during request processing.\n`);
        }
        
    } catch (error: any) {
        console.error("Error deleting uploaded local files from Global Error Handler", error);
    }
};