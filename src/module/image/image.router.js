// Import the Router class from express for creating modular, mountable route handlers
import { Router } from "express";

// Import all exports from the image.controller.js file as imageController
import * as imageController from './image.controller.js';

// Import fileUpload function and fileValidation object from the multer service for handling file uploads
import fileUpload, { fileValidation } from "../../services/multer.js";

// Import the asyncHandler function for handling asynchronous errors in route handlers
import { asyncHandler } from "../../services/errorHandling.js";
import { auth } from "../../middleware/auth.js";
import {  validation } from "../../middleware/validation.js";
import { insert_Image } from "./image.validation.js";

// Create a new router instance
const router = Router();
 
// Define a POST route for inserting an image
// Use the fileUpload middleware with image validation to handle single file uploads under the 'image' field
// Use asyncHandler to wrap the insertImage controller function to catch and handle errors
router.post('/insertImage',validation(insert_Image),auth(),fileUpload(fileValidation.image).single('image'), asyncHandler(imageController.insertImage));

// Export the router as the default export of the module
export default router;
