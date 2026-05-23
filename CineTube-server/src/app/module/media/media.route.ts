import { MediaController } from "./media.controller";

const express = require('express');
const router = express.Router();
//const MediaController = require('./media.controller');



router.get('/',  MediaController.getAllMedia);
router.get('/:id', MediaController.getMediaById);


router.post('/', MediaController.createMedia);
router.put('/:id',   MediaController.updateMedia);
router.delete('/:id',   MediaController.deleteMedia);

export const MediaRouter = router;