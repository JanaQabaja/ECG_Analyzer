// Import the Router function from the Express library to create a new router instance
import { Router } from "express";
// Import all functions from the auth.controller.js file and name them as AuthController
import * as AuthController from './auth.controller.js';
// Import the asyncHandler function from the errorHandling.js service for handling asynchronous errors
import { asyncHandler } from "../../services/errorHandling.js";
import {validation } from "../../middleware/validation.js";
import { forgot_Password, sign_Up } from "./auth.validation.js";
// Create a new router instance
const router = Router();

// Define a POST route for user signup
router.post('/signup',validation(sign_Up), asyncHandler(AuthController.signUp));
// Define a POST route for user signin
router.post('/signin', asyncHandler(AuthController.signIn));
// Define a GET route for email confirmation, using asyncHandler to handle errors
router.get('/confirmEmail/:token', asyncHandler(AuthController.confirmEmail));
// Define a PATCH route for sending a code (for verification), using asyncHandler to handle errors
router.patch('/sendCode', asyncHandler(AuthController.sendCode));
// Define a PATCH route for handling forgotten passwords, using asyncHandler to handle errors
router.patch('/forgotPassword',validation(forgot_Password), asyncHandler(AuthController.forgotPassword));

// Export the router instance as the default export of this module
export default router;
