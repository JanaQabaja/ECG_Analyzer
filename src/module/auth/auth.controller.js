// Import the user model for interacting with the users collection in the database
import userModel from "../../../DB/model/user.model.js";
// Import bcrypt for hashing passwords
import bcrypt from 'bcryptjs';
// Import jsonwebtoken for creating and verifying JWTs
import jwt from "jsonwebtoken";
// Import the sendEmail function for sending emails
import { sendEmail } from '../../services/email.js';
// Import customAlphabet from nanoid for generating custom codes
import { customAlphabet } from "nanoid";

// Function to handle user signup
export const signUp = async (req, res, next) => {
    const { userName, email, password, role } = req.body;

    // Check if the email already exists in the database
    const user = await userModel.findOne({ email });
    if (user) {
        return next(new Error("email already exists", { cause: 409 }));
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUND));

    // Generate a JWT for email confirmation with a 24-hour expiration
    const token = jwt.sign({ email }, process.env.CONFIRMEMAILSECRET, { expiresIn: '24h' });

    // HTML template for the email confirmation
    const html = `
        <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0"><tbody><tr><td class="esd-email-paddings" valign="top">
        <table cellpadding="0" cellspacing="0" class="esd-header-popover es-header" align="center"><tbody><tr><td class="esd-stripe" align="center">
        <table bgcolor="#ffffff" class="es-header-body" align="center" cellpadding="0" cellspacing="0" width="700"><tbody><tr>
        <td class="esd-structure es-p20t es-p10b es-p20r es-p20l" align="left"><table cellpadding="0" cellspacing="0" width="100%"><tbody><tr>
        <td width="660" class="es-m-p0r esd-container-frame" valign="top" align="center"><table cellpadding="0" cellspacing="0" width="100%"><tbody><tr>
        <td align="center" class="esd-block-image" style="font-size: 0px;"><a target="_blank" href="https://viewstripo.email">
        <img class="adapt-img" src="https://ehjasyq.stripocdn.email/content/guids/7648d15e-4544-430a-b117-7e7ed478df41/images/whatsapp_image_20240520_at_24951_am.jpeg" alt="Logo" style="display: block;" title="Logo" height="91"></a>
        </td></tr><tr><td align="center" class="esd-block-spacer es-p10t es-p10b" style="font-size:0">
        <table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0"><tbody><tr>
        <td style="border-bottom: 1px solid #cccccc; background:none; height:1px; width:100%; margin:0px 0px 0px 0px;"></td>
        </tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table>
        </td></tr></tbody></table><table cellpadding="0" cellspacing="0" class="es-content" align="center"><tbody><tr><td class="esd-stripe" align="center">
        <table bgcolor="#ffffff" class="es-content-body" align="center" cellpadding="0" cellspacing="0" width="700"><tbody><tr>
        <td class="esd-structure es-p40t es-p20b es-p20r es-p20l" align="left"><table cellpadding="0" cellspacing="0" width="100%"><tbody><tr>
        <td width="660" class="esd-container-frame" align="center" valign="top"><table cellpadding="0" cellspacing="0" width="100%"><tbody><tr>
        <td align="center" class="esd-block-image" style="font-size: 0px;"><a target="_blank">
        <img src="https://ehjasyq.stripocdn.email/content/guids/CABINET_2663efe83689b9bda1312f85374f56d2/images/10381620386430630.png" alt="image" style="display: block;" width="100"></a></td></tr><tr>
        <td align="center" class="esd-block-text"><h2>Verify your email to finish signing up</h2></td></tr><tr>
        <td align="center" class="esd-block-spacer es-p10t es-p10b es-m-txt-c" style="font-size:0"><table border="0" width="40%" height="100%" cellpadding="0" cellspacing="0" style="width: 40% !important; display: inline-table;"><tbody><tr>
        <td style="border-bottom: 1px solid #cccccc; background:none; height:1px; width:100%; margin:0px 0px 0px 0px;"></td></tr></tbody></table></td></tr><tr>
        <td align="center" class="esd-block-text es-p5t es-p5b es-p40r es-m-p0r" esd-links-underline="none"><p>Thank you for choosing ECG Analyzer.</p>
        <p><br></p><p>Please confirm that <strong><a target="_blank" href="${email}" style="text-decoration: none;">${email}</a></strong>&nbsp;is your email address by clicking on the button below within <strong>24 hours</strong>.</p></td></tr><tr>
        <td align="center" class="esd-block-spacer es-p10t es-p10b es-m-txt-c" style="font-size:0"><table border="0" width="40%" height="100%" cellpadding="0" cellspacing="0" style="width: 40% !important; display: inline-table;"><tbody><tr>
        <td style="border-bottom: 1px solid #cccccc; background:none; height:1px; width:100%; margin:0px 0px 0px 0px;"></td></tr></tbody></table></td></tr><tr>
        <td align="center" class="esd-block-button es-p10t es-p10b es-m-txt-l">
        <a href='${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}' style="display: inline-block; padding: 10px 20px; background-color: lightblue; color: white; text-decoration: none; border-radius: 5px; text-align: center; font-weight: bold; margin-top: 20px; margin-bottom: 20px;">verify</a>
        </td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table>
        </div></body></html>
    `;

    // Send the confirmation email
    await sendEmail(email, "confirm email", html);

    // Create a new user in the database
    const createUser = await userModel.create({ userName, email, password: hashedPassword, role });

    // Respond with success message and the created user
    return res.status(201).json({ message: "success", createUser });
}

// Function to handle email confirmation
export const confirmEmail = async (req, res, next) => {
    const token = req.params.token;

    // Verify the token and decode the payload
    const decoded = jwt.verify(token, process.env.CONFIRMEMAILSECRET);
    if (!decoded) {
        return next(new Error("invalid token", { cause: 404 }));
    }

    // Update the user's confirmEmail field to true
    const user = await userModel.findOneAndUpdate({ email: decoded.email, confirmEmail: false }, { confirmEmail: true });
    if (!user) {
        return res.status(400).json({ message: "invalid verify your email or your email is verified" });
    }

    // Respond with success message
    return res.status(200).json({ message: "success" });
}

// Function to handle user signin
export const signIn = async (req, res, next) => {
    const { email, password } = req.body;

    // Find the user by email
    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "data invalid" });
    }

    // Check if the email is confirmed
    if (!user.confirmEmail) {
        return res.status(400).json({ message: "plz confirm your email" });
    }

    // Compare the provided password with the stored hashed password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return res.status(400).json({ message: "invalid password" });
    }

    // Generate a JWT and a refresh token
    const token = jwt.sign({ id: user._id, role: user.role ,userName:user.userName}, process.env.LOGINSECRET, { expiresIn: '24h' });
    const refreshToken = jwt.sign({ id: user._id, role: user.role }, process.env.LOGINSECRET, { expiresIn: 60 * 60 * 24 * 30 });

    // Respond with success message, token, and refresh token
    return res.status(200).json({ message: "success", token, refreshToken });
}

// Function to handle sending a verification code
export const sendCode = async (req, res, next) => {
    const { email } = req.body;

    // Generate a custom 4-character code
    let code = customAlphabet('1234567890abcdzABCDZ', 4)();
    
    // Update the user's sendCode field with the generated code
    const user = await userModel.findOneAndUpdate({ email }, { sendCode: code }, { new: true });

    // HTML template for the email containing the verification code
    const html = `<table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0"><tbody><tr>
        <td class="esd-email-paddings" valign="top"><table cellpadding="0" cellspacing="0" class="esd-header-popover es-header" align="center"><tbody><tr><td class="esd-stripe" align="center"><table bgcolor="#ffffff" class="es-header-body" align="center" cellpadding="0" cellspacing="0" width="700"><tbody><tr><td class="esd-structure es-p20t es-p10b es-p20r es-p20l" align="left"><table cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td width="660" class="es-m-p0r esd-container-frame" valign="top" align="center"><table cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td align="center" class="esd-block-image" style="font-size: 0px;"><a target="_blank" href="https://viewstripo.email">
        <img class="adapt-img" src="https://ehjasyq.stripocdn.email/content/guids/7648d15e-4544-430a-b117-7e7ed478df41/images/whatsapp_image_20240520_at_24951_am.jpeg" alt="Logo" style="display: block;" title="Logo" height="91"></a>
        </td></tr><tr><td align="center" class="esd-block-spacer es-p10t es-p10b" style="font-size:0">
        <table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0"><tbody><tr>
        <td style="border-bottom: 1px solid #cccccc; background:none; height:1px; width:100%; margin:0px 0px 0px 0px;"></td>
        </tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody>
        </table><table cellpadding="0" cellspacing="0" class="es-content" align="center"><tbody><tr><td class="esd-stripe" align="center">
        <table bgcolor="#ffffff" class="es-content-body" align="center" cellpadding="0" cellspacing="0" width="700">
        <tbody><tr><td class="esd-structure es-p40t es-p20b es-p20r es-p20l" align="left"><table cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td width="660" class="esd-container-frame" align="center" valign="top"><table cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td align="center" class="esd-block-image" style="font-size: 0px;">
        <a target="_blank"><img src="https://ehjasyq.stripocdn.email/content/guids/CABINET_2663efe83689b9bda1312f85374f56d2/images/10381620386430630.png" alt="" style="display: block;" width="100"></a></td></tr><tr><td align="center" class="esd-block-text"><h3>Use your verification code!</h3></td></tr><tr></tr></tbody>
        </table></td></tr><tr><td align="center" class="esd-block-text es-p5t es-p5b es-p40r es-m-p0r" esd-links-underline="none"><h1><span style="background:#efefef">${code}</span></h1></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table><table cellpadding="0" cellspacing="0" class="es-footer esd-footer-popover" align="center"><tbody><tr><td class="esd-stripe" align="center"><table bgcolor="#ffffff" class="es-footer-body" align="center" cellpadding="0" cellspacing="0" width="700"><tbody><tr><td class="esd-structure es-p20r es-p20l" align="left"><table cellpadding="0" cellspacing="0" width="100%">
        <tbody><tr><td width="660" class="esd-container-frame" align="left"><table cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td align="center" class="esd-block-spacer es-p10t es-p10b" style="font-size:0"><table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0"><tbody><tr><td style="border-bottom: 1px solid #cccccc; background:none; height:1px; width:100%; margin:0px 0px 0px 0px;"></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr><tr><td class="esd-structure es-p20" align="left"><table cellpadding="0" cellspacing="0" width="100%"><tbody>
        <tr><td width="660" class="esd-container-frame" align="center" valign="top"><table cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td align="center" class="esd-block-text"><p style="line-height: 150%;">You are receiving this email because you are trying to reset your password.<br></p></td></tr></tbody></table>
        </td></tr></tbody></table></td></tr></tbody></table>
        </td></tr></tbody></table></td></tr></tbody></table>`;
    
    // Send the email with the verification code
    await sendEmail(email, "reset password", html);

    // Respond with success message
    return res.status(200).json({ message: "success" });
}

// Function to handle password reset
export const forgotPassword = async (req, res, next) => {
    const { email, password, code } = req.body;

    // Find the user by email
    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: "not register account" });
    }

    // Check if the provided code matches the stored sendCode
    if (user.sendCode != code) {
        return res.status(400).json({ message: "invalid code" });
    }

    // Check if the new password is the same as the current password
    let match = await bcrypt.compare(password, user.password);
    if (match) {
        return res.status(409).json({ message: "same password" });
    }

    // Hash the new password
    user.password = await bcrypt.hash(password, parseInt(process.env.SALT_ROUND));
    user.sendCode = null;  // Clear the sendCode
    user.changePasswordTime = Date.now();  // Update the password change time
    await user.save();  // Save the user with the new password

    // Respond with success message
    return res.status(200).json({ message: "success" });
}
