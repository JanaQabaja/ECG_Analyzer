// Middleware function to handle asynchronous errors
export const asyncHandler = (fn) => {
    // Return a new function that wraps the original function
    return (req, res, next) => {
        // Call the original function and attach a catch block to handle errors
        fn(req, res, next).catch(error => {
            // Pass the error to the next middleware with a detailed error stack
            return next(new Error(error.stack));
        });
    };
};

// Global error handling middleware
export const globalErrorHandler = (err, req, res, next) => {
    // Return a response with the error status code or 500 (if not specified)
    // and a JSON object containing the error message
    return res.status(err.cause || 500).json({ message: err.message });
};
