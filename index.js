// Import environment variables from a .env file into process.env
import 'dotenv/config';

// Import express framework
import express from 'express';

// Import the function to initialize the application routes
import { initApp } from './src/module/app.router.js';

// Create an instance of the express
const app = express();

// Define the port on which the server will run, default to 3000 if not specified in environment variables
const PORT = process.env.PORT || 3000;

// Initialize the application with routes and middleware
initApp(app, express);

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); // Log a message when the server starts
});
