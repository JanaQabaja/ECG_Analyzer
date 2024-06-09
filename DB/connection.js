// Import the mongoose library to interact with MongoDB
import mongoose from "mongoose";

// Define an asynchronous function to connect to the MongoDB database
const connectDB = async () => {
    try {
        // Attempt to connect to the database using the connection string stored in environment variables
        await mongoose.connect(process.env.DB);
        // Log a success message if the connection is successful
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        // Log an error message if the connection fails
        console.error("Error connecting to MongoDB:", error);
        // Throw the error to propagate it to the calling function or handle it further
        throw error;
    }
};

// Export the connectDB function as the default export of this module
export default connectDB;
