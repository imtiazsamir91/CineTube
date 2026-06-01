import express from 'express';
import { MediaController } from "./media.controller";
import { MediaValidation } from "./media.validation";
import { validateRequest } from "../../middleware/validateRequest"; 
import { upload } from "../../lib/cloudinary.config"; 
import { authMiddleware } from "../../middleware/authMiddleware";

const router = express.Router();

router.get('/', MediaController.getAllMedia);
router.get('/:id', MediaController.getMediaById);

router.post(
    '/', 
    //authMiddleware("ADMIN"),
    upload.fields([
        { name: "coverImage", maxCount: 1 },
        { name: "videoFile", maxCount: 1 }
    ]),
    validateRequest(MediaValidation.createMediaValidationSchema),
    MediaController.createMedia
);

router.put('/:id', authMiddleware("ADMIN"), MediaController.updateMedia);
router.delete('/:id', authMiddleware("ADMIN"), MediaController.deleteMedia);

export const MediaRouter = router;