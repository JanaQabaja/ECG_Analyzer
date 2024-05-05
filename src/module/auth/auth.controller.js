import userModel from "../../../DB/model/user.model.js";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import { sendEmail } from '../../services/email.js';
import { customAlphabet} from "nanoid";


export const signUp =async (req,res,next)=>{
    const {userName, email, password ,role} = req.body;

        const user = await userModel.findOne({email});
        
        if (user){
        return next(new Error("email already exists",{cause:409}));
     }
        
        const hashedPassword=await bcrypt.hash (password, parseInt(process.env.SALT_ROUND));

            const token =jwt.sign({email},process.env.CONFIRMEMAILSECRET);

            const html=  `<a href='${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}'>verify</a>`
        await sendEmail(email, "confirm email",html); 
        const createUser = await userModel.create({userName, email, password:hashedPassword,role})
        
        return res.status(201).json({message: "success", createUser})
}



export const confirmEmail =async(req, res,next)=>{

    const token = req.params.token;
const decoded =jwt.verify(token, process.env.CONFIRMEMAILSECRET);
if(!decoded){
    return next(new Error("invalid token",{cause:404}));
} 
const user =await userModel.findOneAndUpdate({email:decoded.email,confirmEmail:false},{confirmEmail: true});

if(!user){
return res.status(400).json({message: "invalid verify your email or your email is verified"});}
return res.status(200).json({message: "success"});

    
}

export const signIn =async(req, res,next)=>{

    const {email, password} = req.body;
    
    const user= await userModel.findOne({email});
    
    if(!user){
    return res.status(400).json({message:"data invalid"}); }

    if(!user.confirmEmail){
        return res.status(400).json({message:"plz confirm your email"}); }

    const match = await bcrypt.compare(password,user.password);
    if(!match){
    return res.status(400).json({message: "invalid password"});
    }
    const token =jwt.sign({id:user._id ,role:user.role},process.env.LOGINSECRET,{expiresIn:'5m'})
    const refreshToken =jwt.sign({id:user._id ,role:user.role},process.env.LOGINSECRET,
        {expiresIn:60*60*24*30})
    return res.status(200).json({message: "success", token , refreshToken});
}


    export const sendCode = async(req, res,next)=>{

        const {email} = req.body;
        let code = customAlphabet ('1234567890abcdzABCDZ', 4)
        code =code();
        const user = await userModel.findOneAndUpdate({email}, {sendCode:code},{new: true});
        const html = `<h2>code is : ${code} </h2>`;
        await sendEmail(email,`reset password`,html);
        return res.status(200).json({message: "success"});
    }




    export const forgotPassword= async(req,res,next)=>{
        const {email, password,code} = req.body;
        const user = await userModel.findOne({email});
        if(!user){
        return res.status(404).json({message:"not register account"}); }
        
        if(user.sendCode !=code) {
        return res.status(400).json({message: "invalid code"});}
        
        let match = await bcrypt.compare(password, user.password);
        if(match){
        return res.status(409).json({message:"same password"});}
    
        user.password= await bcrypt.hash(password,parseInt(process.env.SALT_ROUND));
        user.sendCode=null;
        user.changePasswordTime=Date.now();
        await user.save();
        return res.status(200).json({message: "success"});
        }

        export const deleteInvalidConfirm = async(req, res ,next)=>{
            const user = await userModel.deleteMany({confirmEmail:false});
            return res.status(200).json({message: "success"});
        }