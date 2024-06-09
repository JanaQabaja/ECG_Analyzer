import joi from 'joi';
import { generalFields } from '../../middleware/validation.js';

export const sign_Up = joi.object({
    email: generalFields.email,
    password: generalFields.password,
    confirmPassword: generalFields.confirmPassword,
    userName: generalFields.userName
}).unknown(); // Allow unknown fields in the request body


export const forgot_Password = joi.object({
    password: generalFields.password,

}).unknown(); // Allow unknown fields in the request body
