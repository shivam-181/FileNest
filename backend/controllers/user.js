const userModel=require("../models/user.model.js");
const fileModel=require("../models/file.model.js");
const supabase=require("../config/supabase.config.js");

async function deleteFolder(folderName){
    try{
        const limit=1000;
        const offset=0;
        const {data:files,error}=await supabase
        .storage
        .from("UserFiles")
        .list(folderName,{limit,offset});
        if(error){
            return{
                success:false,
                message:"operation failed",
                error:error.message
            }
        }
        if(!files||files.length===0){
            return{
                success:true,
                message:"no files, nothing to delete"
            }
        }
        const filePaths=files.map(file=>`${folderName}/${file.name}`);
        const {error:deleteError}=await supabase
        .storage
        .from("UserFiles")
        .remove(filePaths);
        if(deleteError){
            return{
                success:false,
                message:"operation failed",
                error:deleteError.message
            }
        }
        return{
            success:true,
            message:"User account is deleted successfully"
        }
    }
    catch(err){
        return{
            success:false,
            message:"Server error",
            error:err.message
        }
    }
}

async function deleteAccount(req,res){
    try{
        let userId=req.user.id;
        let deletedUser=await userModel.findByIdAndDelete(userId);
        if(!deletedUser){
            return res.status(400).json({
                success:false,
                message:"Deletion failed"
            });
        }
        await fileModel.deleteMany({owner:deletedUser._id});
        let result=await deleteFolder(deletedUser._id);
        if(result.success){
            result=await deleteFolder(`profile-pictures/${deletedUser._id}`);
            if(result.success){
                return res.status(200).json(result);
            }
            else{
                return res.status(400).json(result);
            }
        }
        else{
            return res.status(400).json(result);
        }
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Server error",
            error:err.message
        });
    }
}

module.exports=deleteAccount;