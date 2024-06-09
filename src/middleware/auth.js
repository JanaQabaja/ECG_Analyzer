import jwt from "jsonwebtoken";
import userModel from "../../DB/model/user.model.js";

// Middleware function for authentication
// This function ensures the user is logged in (authenticated)
export const auth = () => {
    return async (req, res, next) => {
        // Extract authorization header
        const { authorization } = req.headers;

        // Check if authorization header is present and starts with the correct key
        if (!authorization?.startsWith(process.env.BEARERKEY)) {
            return res.status(400).json({ message: "Invalid authorization" });
        }

        // Extract the token from the authorization header
        const token = authorization.split(process.env.BEARERKEY)[1];

        try {
            // Verify the token
            const decoded = jwt.verify(token, process.env.LOGINSECRET);

            // Find the user by ID and select relevant fields
            const user = await userModel.findById(decoded.id).select("userName role changePasswordTime");

            // Check if the user does not exist
            if (!user) {
                return res.status(404).json({ message: "Not registered user" });
            }

            // Check if the password has been changed since the token was issued
            if (parseInt(user.changePasswordTime?.getTime() / 1000) > decoded.iat) {
                return next(new Error(`Expired token, please login`, { cause: 400 }));
            }

            // Attach user information to the request object
            req.user = user;

            // Proceed to the next middleware or route handler
            next();
        } catch (error) {
            return res.status(400).json({ message: "Invalid authorization" });
        }
    }
}
