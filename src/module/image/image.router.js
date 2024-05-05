import { Router } from "express";
import * as imageController from './image.controller.js';
import fileUpload, { fileValidation } from "../../services/multer.js";
import { asyncHandler } from "../../services/errorHandling.js";
 
const router =Router();
 
router.post('/insertImage',fileUpload(fileValidation.image).single('image'),asyncHandler(imageController.insertImage));

export default router ;
// import { Router } from "express";
// import * as imageController from './image.controller.js';
// import fileUpload from "../../services/multer.js";
// import { asyncHandler } from "../../services/errorHandling.js";

// const router = Router();

// // Assuming the route is '/insertImage' for image upload
// router.post('/insertImage', asyncHandler(imageController.insertImage));

// export default router;