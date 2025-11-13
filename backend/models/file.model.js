const mongoose=require("mongoose");
const fileSchema=new mongoose.Schema({
    originalname:String,
    path:String,
    publicUrl:String,
    fileType:String,
    addedOn:{
        type:Date,
        default:Date.now()
    },
    fileSize:{
        type:Number,
        max:10*1024*1024
    },
    owner:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }]
});
const fileModel=mongoose.model("file",fileSchema);
module.exports=fileModel;