import { Router } from "express";
import * as AuthController from './auth.controller.js';
import fileUpload, { fileValidation } from "../../services/multer.js";
import { asyncHandler } from "../../services/errorHandling.js";
 
const router =Router();

router.post('/signup',fileUpload(fileValidation.image).single('image'),asyncHandler(AuthController.signUp));
router.post('/signin',asyncHandler(AuthController.signIn));
router.get('/confirmEmail/:token',asyncHandler(AuthController.confirmEmail));
router.patch('/sendCode',asyncHandler(AuthController.sendCode));
router.patch('/forgotPassword',asyncHandler(AuthController.forgotPassword));
router.delete('/invalidConfirm',asyncHandler(AuthController.deleteInvalidConfirm));
export default router ;