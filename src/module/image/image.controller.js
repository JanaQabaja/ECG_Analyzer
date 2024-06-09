// Import the spawn function from the child_process module to spawn new processes
import { spawn } from "child_process";

// Controller function to handle the insertion of an image
export const insertImage = async (req, res) => {
    try {
        // Call the callPredict function with the path of the uploaded image and await its result
        const prediction = await callPredict(req.file.path);

        // Send a success response with the prediction
        res.status(200).json({ "msg": 'Successfully Upload', prediction });
    } catch (error) {
        // Log any errors that occur
        console.error(error);

        // Send an error response if there was a problem
        res.status(500).json({ "msg": 'Error while uploading' });
    } 
};

// Function to call a Python script and return a prediction
export const callPredict = async (imagePath) => {
    return new Promise((resolve, reject) => {
        // Log the image path for debugging
        console.log("Image path:", imagePath);

        // Spawn a new Python process to run the specified script with the image path as an argument
        const python = spawn('python', ["C:/Users/PC/Desktop/ECG_Analyzer/python/app.py", imagePath]);
        let prediction = '';

        // Event listener for data from the Python process's stdout
        python.stdout.on('data', (data) => {
            // Append the data to the prediction string
            prediction += data.toString();
        });

        // Event listener for errors from the Python process
        python.on('error', (error) => {
            // Log the error message
            console.error('error: ', error.message);

            // Reject the promise with the error
            reject(error);
        });

        // Event listener for when the Python process closes
        python.on('close', async (code) => {
            // Log the exit code of the Python process
            console.log('child process exited with code ', code);

            // Extract the prediction for ECG from the output string
            const startIndex = prediction.indexOf("Prediction for ECG:") + "Prediction for ECG:".length;
            const endIndex = prediction.indexOf('\n', startIndex);
            const predictionForECG = prediction.substring(startIndex, endIndex).trim();

            // Resolve the promise with the extracted prediction
            resolve(predictionForECG);
        });
    });
};
