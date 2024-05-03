import { spawn } from "child_process";
import cloudinary from "../../../services/cloudinary.js";
import ImageModel from "../../../../DB/model/image.model.js";
import UserModel from "../../../../DB/model/user.model.js";
// export const insertImage = async (req, res) => {
//   try {
   
//       const { secure_url, public_id } = await cloudinary.uploader.upload(
//         req.file.path,
//         {
//           folder: `${process.env.APP_NAME}/patients`,
//         }
//       )
//       //const id = await getId(req);
//       const predect=callPredect(req, id);
//       res.status(200).json({ "msg": 'Successfully Upload', secure_url, public_id ,predect});
    
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ "msg": ' Error while uploading' });
//   }

// };

// export const callPredect = async (req, res) => {
//     const python = spawn('python', ["python/app2.py", req.file.path]);
//     let outputData = '';
  
//     python.stdout.on('data', (data) => {
//       outputData += data.toString();
//     });
  
//     python.on('error', (error) => {
//       console.error('error: ', error.message);
//     });
  
//     python.on('close', async (code) => {
//       console.log('child process exited with code ', code);
  
//       // Now 'outputData' contains the output of the Python script
//       console.log('Output: ', outputData);
//       // Define a regular expression pattern to match any word in that position
//       const lines = outputData.split('\n');
//       const lastLine = lines[lines.length - 1];
  
//       // Trim any leading or trailing whitespaces
//       const cleanedResult = lastLine.trim();
  
//       let predect = cleanedResult;
//       // const id = await getId(req);
     
//       const imageData = await ImageModel.create({
//         id,
//         Path: req.file.path
//       });
//       res.status(200).json({ "msg": 'Successfully Predict', "predect": predect });
  
//       return predect;
  
//     });
//   };
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
// import { spawn } from "child_process";
// import cloudinary from "../../../services/cloudinary.js";
// import ImageModel from "../../../../DB/model/image.model.js";
// import UserModel from "../../../../DB/model/user.model.js";

// export const callPredect = async (req, res) => {
//     try {
//         const { secure_url, public_id } = await cloudinary.uploader.upload(
//             req.file.path,
//             {
//                 folder: `${process.env.APP_NAME}/patients`,
//             }
//         );

//         const python = spawn('python', ["python/app2.py", req.file.path]);
//         let outputData = '';

//         python.stdout.on('data', (data) => {
//             outputData += data.toString();
//         });

//         python.on('error', (error) => {
//             console.error('error: ', error.message);
//             res.status(500).json({ "msg": 'Error while processing' });
//         });

//         python.on('close', async (code) => {
//             console.log('child process exited with code ', code);

//             // Now 'outputData' contains the output of the Python script
//             console.log('Output: ', outputData);
//             // Define a regular expression pattern to match any word in that position
//             const lines = outputData.split('\n');
//             const lastLine = lines[lines.length - 1];

//             // Trim any leading or trailing whitespaces
//             const cleanedResult = lastLine.trim();

//             let predect = cleanedResult;
//             // const id = await getId(req);
            
//             const imageData = await ImageModel.create({
//                 id,
//                 Path: req.file.path
//             });

//             res.status(200).json({ "msg": 'Successfully Predict', "secure_url": secure_url, "public_id": public_id, "predect": predect });

//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ "msg": 'Error while uploading' });
//     }
// };

///////////////////////////////////////////////////////////////////////////////////




import { spawn } from "child_process";
import cloudinary from "../../../services/cloudinary.js";
import ImageModel from "../../../../DB/model/image.model.js";
import UserModel from "../../../../DB/model/user.model.js";

// Function to call prediction
const callPredict = async (req, imagePath) => {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', ['C:/Users/PC/Desktop/ECG_Analyzer/python/app.py', imagePath]);
        
        pythonProcess.stdout.on('data', (data) => {
            resolve(data.toString());
        });

        pythonProcess.stderr.on('data', (data) => {
            reject(data.toString());
        });
    });
}

// Route to insert image and get prediction
export const insertImage = async (req, res) => {
    try {
        const { secure_url, public_id } = await cloudinary.uploader.upload(
            req.file.path,
            {
                folder: `${process.env.APP_NAME}/patients`,
            }
        );

        // Call prediction function
        const prediction = await callPredict(req, req.file.path);

        res.status(200).json({ "msg": 'Successfully Upload', secure_url, public_id, prediction });
    } catch (error) {
        console.error(error);
        res.status(500).json({ "msg": ' Error while uploading' });
    }
};
