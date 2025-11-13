const userModel=require("../models/user.model.js");
const fileModel=require("../models/file.model.js");
const supabase=require("../config/supabase.config.js");
const {docType,imageType,mediaType}=require("./upload.js");

const fileStorage=async(req,res)=>{
    try{
        let user=await userModel.findById(req.user.id).populate("files");
        if(!user){
            return res.status(400).json({
                success:false,
                message:"Invalid user"
            });
        }
        const totalSize=user.files.reduce((acc,item)=>{
            return acc+=item.fileSize;
        },0);
        res.status(200).json({
            success:true,
            totalSize
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

const fetchDocs=async(req,res)=>{
    const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
        "application/json",
        "application/xml",
        "text/csv",
        "text/markdown"
    ];
    try{
        let user=await userModel.findById(req.user.id).populate({
            path:"files",
            match:{
                fileType:{$in:allowedTypes}
            }
        });
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User invalid"
            });
        }
        return res.status(200).json({
            success:true,
            message:"Docs fetched successfully",
            files:user.files.reverse()
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

const deleteFile=async(req,res)=>{
    try{
        const docType=["application/pdf","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document","text/plain","application/json","text/csv","text/markdown"];
        const imageType=["image/png","image/gif","image/jpeg","image/svg+xml","image/x-icon","image/webp"];
        const mediaType=["video/mp4","audio/mpeg"];
        const {filepath}=req.body;
        if(!filepath||typeof filepath!=="string"){
            return res.status(400).json({
                success:false,
                message:"file path is required"
            });
        }
        const {data,error}=await supabase
        .storage
        .from("UserFiles")
        .remove([filepath]);
        if(error){
            return res.status(400).json({
                success:false,
                message:"Deletion failed",
                error:error.message
            });
        }
        const deletedFile=await fileModel.findOneAndDelete({path:filepath});
        if(!deletedFile){
            return res.status(400).json({
                success:false,
                message:"File not found in DB"
            });
        }
        let user=await userModel.findById(req.user.id); //it expects user files array of ObjectIds
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not exists"
            });
        }
        user.files=user.files.filter((file)=>{ //user.files -> array of objectIds
            return file._id.toString()!==deletedFile._id.toString();
        });
        if(docType.includes(deletedFile.fileType)){
            user.docUpdate=new Date();
        }
        else if(imageType.includes(deletedFile.fileType)){
            user.imageUpdate=new Date();
        }
        else if(mediaType.includes(deletedFile.fileType)){
            user.mediaUpdate=new Date();
        }
        else{
            user.otherUpdate=new Date();
        }
        await user.save();
        return res.status(200).json({
            success:true,
            message:"File deleted successfully",
            data
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

const getEachStorage=async(req,res)=>{
    try{
        const docType=["application/pdf","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document","text/plain","application/json","text/csv","text/markdown"];
        const imageType=["image/png","image/gif","image/jpeg","image/svg+xml","image/x-icon","image/webp"];
        const mediaType=["video/mp4","audio/mpeg"];
        let user=await userModel.findById(req.user.id).populate("files");
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not found"
            });
        }
        let docStorage=0;
        let imageStorage=0;
        let mediaStorage=0;
        let otherStorage=0;
        user.files.forEach((file)=>{
            if(docType.includes(file.fileType)){
                docStorage+=file.fileSize;
            }
            else if(imageType.includes(file.fileType)){
                imageStorage+=file.fileSize;
            }
            else if(mediaType.includes(file.fileType)){
                mediaStorage+=file.fileSize;
            }
            else{
                otherStorage+=file.fileSize;
            }
        });
        return res.status(200).json({
            success:true,
            message:"Storage fetched successfully",
            docStorage,
            imageStorage,
            mediaStorage,
            otherStorage,
            docUpdate:user.docUpdate,
            imageUpdate:user.imageUpdate,
            mediaUpdate:user.mediaUpdate,
            otherUpdate:user.otherUpdate
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

const getImages=async(req,res)=>{
    const allowedTypes=["image/png","image/gif","image/jpeg","image/svg+xml","image/x-icon","image/webp"];
    try{
        const user=await userModel.findById(req.user.id).populate({
            path:"files",
            match:{
                fileType:{$in:allowedTypes}
            }
        });
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not exists"
            });
        }
        return res.status(200).json({
            success:true,
            message:"Images fetched successfully",
            images:user.files.reverse()
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

const getMedia=async(req,res)=>{
    const allowedTypes=["video/mp4","audio/mpeg"];
    try{
        let user=await userModel.findById(req.user.id).populate({
            path:"files",
            match:{
                fileType:{$in:allowedTypes}
            }
        });
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not exists"
            });
        }
        return res.status(200).json({
            success:true,
            message:"Files fetched successfully",
            media:user.files.reverse()
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

const getUserProfile=async(req,res)=>{
    try{
        const loggedInUser=req.user;
        if(!loggedInUser) return res.status(400).json({success:false,message:"No user, auth denied"});
        let user=await userModel.findById(loggedInUser.id);
        if(!user) return res.status(400).json({success:false,message:"User Invalid"});
        const profileUrl=user.profilePicture;
        if(!profileUrl) return res.status(400).json({success:false,message:"No profile uploaded."});
        return res.status(200).json({success:true,message:"Profile fetched successfully.",profileUrl});
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Server error",
            error:err.message
        });
    }
}

const getOthers=async(req,res)=>{
    try{
        let user=await userModel.findById(req.user.id).populate({
            path:"files",
            match:{
                fileType:{$nin:[...docType,...imageType,...mediaType]} //merge all these array in one
            }                                                          //nin=not in
        });
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User invalid"
            });
        }
        return res.status(200).json({
            success:true,
            message:"Files fetched successfully",
            others:user.files.reverse()
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

const getAllFiles=async(req,res)=>{
    try{
        //get the very starting moment of the day
        const startOfDay=new Date();
        startOfDay.setHours(0,0,0,0);
        //get the very last moment of the day
        const endOfDay=new Date();
        endOfDay.setHours(23,59,59,999);
        let user=await userModel.findById(req.user.id).populate({
            path:"files",
            match:{
                addedOn:{
                    $gte:startOfDay, //$gte=greater than and equal to
                    $lte:endOfDay //$lte=lower than and equal to
                }
            }
        });
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User invalid."
            });
        }
        return res.status(200).json({
            success:true,
            message:"Files fetched successfully",
            files:user.files.reverse()
        });
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Failed to fetch history.",
            err:err.message
        });
    }
}

async function deleteFolder(foldername){
    try{
        const limit=1000;
        const offset=0;
        const {data:files,error}=await supabase
        .storage
        .from("UserFiles")
        .list(foldername,{limit,offset});
        if(error){
            return{
                success:false,
                message:"Operation failed",
                error:error.message
            };
        }
        if(!files||files.length===0){
            return{
                success:false,
                message:"No profile"
            };
        }
        let filesPath=files.map((file)=>`${foldername}/${file.name}`);
        const {error:deleteError}=await supabase
        .storage
        .from("UserFiles")
        .remove([filesPath]);
        if(deleteError){
            return{
                success:false,
                message:"Operation failed",
                error:deleteError.message
            };
        }
        return{
            success:true,
            message:"Profile removed."
        }
    }
    catch(err){
        return{
            success:false,
            message:"Server error, try again",
            error:err.message
        }
    }
}

async function removeProfile(req,res){
    try{
        const loggedInUser=req.user;
        if(!loggedInUser){
            return res.status(400).json({
                success:false,
                message:"Invalid user, auth denied"
            });
        }
        let user=await userModel.findById(req.user.id);
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not exists."
            });
        }
        user.profilePicture="";
        await user.save();
        const result=await deleteFolder(`profile-pictures/${user._id}`);
        if(result.success){
            return res.status(200).json(result);
        }
        else{
            return res.status(400).json(result);
        }
    }
    catch(err){
        return res.status(500).json({
            success:500,
            message:"Server error, try again",
            error:err.message
        });
    }
}

module.exports={fileStorage,fetchDocs,deleteFile,getEachStorage,getImages,getMedia,getUserProfile,getOthers,getAllFiles,removeProfile};