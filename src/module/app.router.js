import connectDB from '../../DB/connection.js';
import authRouter from './auth/auth.router.js';

import imageRouter from './image/image.router.js'
//import { sendEmail } from '../services/email.js';
import cors from 'cors';
import { globalErrorHandler } from '../services/errorHandling.js';

export const initApp = async(app, express)=>{
    app.use(cors());
app.use(express.json());
connectDB();

app.get('/', (req, res)=>{
return res.status(200).json({message: "welcome"});})

app.use('/auth',authRouter);
app.use('/image', imageRouter);
app.get("*", (req, res)=>{
return res.status(500).json({message: "page not found"});
})
app.use(globalErrorHandler);
}
