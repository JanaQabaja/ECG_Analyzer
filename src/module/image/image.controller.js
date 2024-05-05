
import { spawn } from "child_process";
import cloudinary from "../../services/cloudinary.js";


export const insertImage = async (req, res) => {
    
    try {
        const { secure_url, public_id } = await cloudinary.uploader.upload(
            req.file.path,
            { 
                folder: `${process.env.APP_NAME}/patients`,
            }
        );

        // // Call prediction function
        const prediction = await callPredict(req.file.path);
        // const prediction = await callPredict(req, req.file.path);

        res.status(200).json({ "msg": 'Successfully Upload', secure_url, public_id,prediction});
    } catch (error) {
        console.error(error);
        res.status(500).json({ "msg": ' Error while uploading' });
    } 
};


export const callPredict = async (imagePath) => {
    return new Promise((resolve, reject) => {
        console.log("Image path:", imagePath); // Log the image path
        const python = spawn('python', ["C:/Users/PC/Desktop/ECG_Analyzer/python/app.py", imagePath]);
        let prediction = '';

        python.stdout.on('data', (data) => {
            prediction += data.toString();
        });
        python.on('error', (error) => {
            console.error('error: ', error.message);
            reject(error);
        });

        python.on('close', async (code) => {
            console.log('child process exited with code ', code);
            // Extract prediction for ECG
            const startIndex = prediction.indexOf("Prediction for ECG:") + "Prediction for ECG:".length;
            const endIndex = prediction.indexOf('\n', startIndex);
            const predictionForECG = prediction.substring(startIndex, endIndex).trim();
            // Resolve the promise with the prediction
            resolve(predictionForECG);
        });

    });
};

