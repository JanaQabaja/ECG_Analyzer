// Import the Joi library for schema validation
import joi from "joi";

// Define a set of common validation schemas as an object
export const generalFields = {

    // Define an email validation schema
    email: joi.string().email().required().min(8).messages({
        'string.empty': "email is required",            // Custom message for empty email
        'string.email': "please enter a valid email"       // Custom message for invalid email format
    }),

    // Define a password validation schema
    password: joi.string().required().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')).messages({
        'string.empty': "password is required",         // Custom message for empty password
        'string.pattern.base': "password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character"
    }),
    // Define a confirm password validation schema
    confirmPassword: joi.string().required().valid(joi.ref('password')).messages({
        'any.only': "confirm password must match the password",
        'string.empty': "confirm password is required"
    }),

     // Define a username validation schema
       userName: joi.string().required().min(3).max(20).messages({
        'string.empty': "username is required",
        'string.min': "username must be at least 3 characters long",
        'string.max': "username must be at most 20 characters long"
    }),
    // Define a file validation schema as an object with specific properties
    file: joi.object({
        path: joi.string().required(),                  // Validate that file path is a string
        filename: joi.string().required(),              // Validate that file name is a string
        mimetype: joi.string().required(),              // Validate that file mimetype is a string
    })
}


// Export a middleware function for validation
export const validation = (schema) => {

    // Return a middleware function to be used in route handlers
    return (req, res, next) => {
        // Combine request body, params, and query into a single object for validation
        const inputsData = { ...req.body, ...req.params, ...req.query };

        // If there's a file or files in the request, add it to the inputsData
        if (req.file || req.files) {
            inputsData.file = req.file || req.files;
        }

        // Validate the combined input data against the provided schema
        const validationResult = schema.validate(inputsData, { abortEarly: false });

        // If there are validation errors, return a 400 response with the error details
        if (validationResult.error?.details) {
            return res.status(400).json({
                message: "validation error",
                validationError: validationResult.error?.details
            });
        }

        // If validation passes, proceed to the next middleware or route handler
        next();
    }
}
