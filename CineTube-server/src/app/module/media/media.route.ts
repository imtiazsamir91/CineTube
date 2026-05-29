import { authMiddleware } from "../../middleware/authMiddleware";
import { MediaController } from "./media.controller";

const express = require('express');
const router = express.Router();
//const MediaController = require('./media.controller');



router.get('/',  MediaController.getAllMedia);
router.get('/:id', MediaController.getMediaById);
// router.post(
//   "/create", 
//   authMiddleware("ADMIN"), 
//   MediaController.createMedia
// );

router.get("/search", MediaController.getAllMedia);
router.post('/', MediaController.createMedia);
router.put('/:id',   MediaController.updateMedia);
router.delete('/:id',   MediaController.deleteMedia);

export const MediaRouter = router;