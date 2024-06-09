import multer from "multer";

// Define acceptable file types for validation
export const fileValidation = {
    image: ['image/png', 'image/jpeg', 'image/webp'] // Only allow these image types
};

// Function to configure and return a multer instance for file upload
export default function fileUpload(customValidation = []) {
    // Define storage configuration for multer
    const storage = multer.diskStorage({}); // Using default storage settings

    // Custom file filter function to validate file types
    function fileFilter(req, file, cb) {
        // Check if the file's MIME type is in the list of allowed types
        if(customValidation.includes(file.mimetype)) {
            // Accept the file
            cb(null, true);
        } else {
            // Reject the file with an error message
            cb("invalid format", false);
        }
    }

    // Create a multer instance with the custom file filter and storage settings
    const upload = multer({ fileFilter, storage });
    
    // Return the configured multer instance
    return upload;
}




