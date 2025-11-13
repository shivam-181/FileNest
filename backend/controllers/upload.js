const supabase=require("../config/supabase.config.js");
const userModel=require("../models/user.model.js");
const fileModel=require("../models/file.model.js");

const getDateString=(now)=>{
    const day=String(now.getDate()).padStart(2,"0");
    const month=String(now.getMonth()+1).padStart(2,"0");
    const year=now.getFullYear();
    return `${year}.${month}.${day}`;
};

const getTimeString=(now)=>{
    let hours=now.getHours();
    const minutes=String(now.getMinutes()).padStart(2,"0");
    const seconds=String(now.getSeconds()).padStart(2,"0");
    hours=hours%12; //24hr -> 12hr format
    if(hours===0) hours=12;
    return `${hours}.${minutes}.${seconds}`;
}

const docType=["application/pdf","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document","text/plain","application/json","text/csv","text/markdown"];
const imageType=["image/png","image/gif","image/jpeg","image/svg+xml","image/x-icon","image/webp"];
const mediaType=["video/mp4","audio/mpeg"];

const uploadFile=async(req,res)=>{
    try{
        const loggedInUser=await userModel.findById(req.user.id);
        if(!loggedInUser){
            return res.status(400).json({
                success:false,
                message:"Invalid user data"
            });
        }
        const file=req.file;
        if(!file){
            return res.status(400).json({
                success:false,
                message:"No file uploaded"
            });
        }
        const now=new Date();
        const date=getDateString(now);
        const time=getTimeString(now);
        const path=`${loggedInUser._id}/${date}-${time}-${file.originalname}`;
        const {error:uploadError,data:uploadData}=await supabase
        .storage
        .from("UserFiles")
        .upload(path,file.buffer,{
            contentType:file.mimetype
        });
        if(uploadError){
            return res.status(400).json({
                success:false,
                message:"Something went wrong",
                error:uploadError.message
            });
        }
        const {data}=supabase
        .storage
        .from("UserFiles")
        .getPublicUrl(uploadData.path);
        const publicUrl=data.publicUrl;
        const newFile=await fileModel.create({
            originalname:file.originalname,
            path,
            publicUrl,
            fileType:file.mimetype,
            addedOn:now,
            fileSize:file.size,
            owner:loggedInUser._id
        });
        loggedInUser.files.push(newFile._id);
        if(docType.includes(newFile.fileType)){
            loggedInUser.docUpdate=now;
        }
        else if(imageType.includes(newFile.fileType)){
            loggedInUser.imageUpdate=now;
        }
        else if(mediaType.includes(newFile.fileType)){
            loggedInUser.mediaUpdate=now;
        }
        else{
            loggedInUser.otherUpdate=now;
        }
        await loggedInUser.save();
        return res.status(200).json({
            success:true,
            message:"File successfully uploaded"
        });
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Server error",
            error:err.message
        });
    }
};

const uploadProfile=async(req,res)=>{
    try{
        const loggedInUser=req.user;
        if(!loggedInUser){
            return res.status(401).json({
                success:false,
                message:"Invalid user, auth denied."
            });
        }  
        let user=await userModel.findById(loggedInUser.id);
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not exists."
            });
        }
        const profile=req.file; //this is how you get file when you send file using multer in formData.
        const path=`profile-pictures/${user._id}/${Date.now()}-${profile.originalname}`;
        const {data:uploadData,error:uploadError}=await supabase.storage.from("UserFiles").upload(path,profile.buffer,{
            contentType:profile.mimetype
        });
        if(uploadError){
            return res.status(400).json({
                success:false,
                message:"Upload failed.",
                error:uploadError.message
            });
        }
        const {data:publicData}=supabase
        .storage
        .from("UserFiles")
        .getPublicUrl(path);
        user.profilePicture=publicData.publicUrl;
        await user.save();
        return res.status(200).json({
            success:true,
            message:"Profile set successfully."
        });
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Server error",
            error:err.message
        });
    }
};

module.exports={uploadFile,uploadProfile,docType,imageType,mediaType};