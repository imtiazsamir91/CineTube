import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import { envVars } from "../config/env";
; 
cloudinary.config({
  cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
  api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDINARY.CLOUDINARY_API_SECRET,
});


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
   
    const isVideo = file.mimetype.startsWith("video");
    
    return {
      folder: "cinetube", 
      resource_type: isVideo ? "video" : "image",
      allowed_formats: isVideo ? ["mp4", "mkv", "avi"] : ["jpg", "jpeg", "png", "webp"],
      public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
    };
  },
});


export const upload = multer({ storage: storage });