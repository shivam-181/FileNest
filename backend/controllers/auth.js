const userModel=require("../models/user.model.js");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const {validationResult}=require("express-validator");

const signup=(req,res)=>{
    try{
        const errors=validationResult(req);
        if(errors.isEmpty()){
            const {fullname,email,password}=req.body;
            bcrypt.hash(password,10,async(err,hash)=>{
                let newUser=await userModel.create({
                    fullname,
                    email,
                    password:hash
                });
                return res.status(201).json({
                    message:"User created",
                    success:true,
                    user:newUser
                });
            });
        }
        else{
            return res.status(400).json({
                message:"Validation failed",
                success:false,
                error:errors.array()
            });
        }
    }
    catch(err){
        res.status(500).json({
            message:"Server error",
            error:err.message,
            success:false
        });
    }
}

const login=async(req,res)=>{
    try{
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                message:"Validation failed",
                success:false
            });
        }
        const {email,password}=req.body;
        let user=await userModel.findOne({email});
        if(!user){
            return res.status(400).json({
                message:"User not exists",
                success:false
            });
        }
        const isMatch=await bcrypt.compare(password,user.password);
        const userData=user.toObject();
        delete userData.password;
        if(!isMatch){
            return res.status(400).json({
                message:"Email or password is incorrect",
                success:false
            });
        }
        const token=jwt.sign(
            {email:user.email,id:user._id},
            process.env.JWT_SECRET,
            {expiresIn:"24h"}
        );
        res.cookie("token",token,{
            httpOnly:true, //JS can't access token in frontend
            secure:false,
            sameSite:"lax" //allowed cross-origin domain
        });
        return res.status(200).json({
            success:true,
            message:"Login Successfull",
            user:userData
        });
    }
    catch(err){
        res.status(500).json({
            message:"Server error",
            error:err.message,
            success:false
        });
    }
}

const logout=async(req,res)=>{
    try{
        res.cookie("token","",{
            httpOnly:true,
            secure:false,
            sameSite:"lax",
            expiresIn:new Date(0)
        });
        return res.status(200).json({
            success:true,
            message:"Logout successfull."
        });
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Server error",
            error:err.message
        });
    }
}

module.exports={signup,login,logout};