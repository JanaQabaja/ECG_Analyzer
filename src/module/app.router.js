// Import the function to connect to the database
import connectDB from '../../DB/connection.js';

// Import the authentication router
import authRouter from './auth/auth.router.js';

// Import the image router
import imageRouter from './image/image.router.js';

// Import CORS middleware
import cors from 'cors';

// Import the global error handler
import { globalErrorHandler } from '../services/errorHandling.js';

// Function to initialize the application
export const initApp = async (app, express) => {
    // Enable CORS for all routes
    app.use(cors());
    
    // Enable parsing of JSON request bodies
    app.use(express.json());
    
    // Connect to the database
    connectDB();

    // Define a root route for a welcome message
    app.get('/', (req, res) => {
        return res.status(200).json({ message: "welcome" });
    });

    // Use the authentication router for routes starting with /auth
    app.use('/auth', authRouter);
    
    // Use the image router for routes starting with /image
    app.use('/image', imageRouter);
    
    // Handle all undefined routes with a 500 error
    app.get("*", (req, res) => {
        return res.status(500).json({ message: "page not found" });
    });

    // Use the global error handler middleware
    app.use(globalErrorHandler);
};
