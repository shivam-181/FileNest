const express=require("express");
const router=express.Router();
const upload=require("../config/multer.config.js");
const {uploadFile,uploadProfile}=require("../controllers/upload.js");
const isLoggedIn=require("../middlewares/isLoggedIn.js");
const {fileStorage,getUserProfile,getAllFiles,removeProfile}=require("../controllers/file.js");
const deleteAccount=require("../controllers/user.js");

router.post("/upload",isLoggedIn,upload.single("uploaded-file"),uploadFile);
router.get("/usedStorage",isLoggedIn,fileStorage);
router.post("/uploadProfile",isLoggedIn,upload.single("profile"),uploadProfile);
router.get("/getProfile",isLoggedIn,getUserProfile);
router.get("/getUploadHistory",isLoggedIn,getAllFiles);
router.delete("/deleteAccount",isLoggedIn,deleteAccount);
router.delete("/removeProfile",isLoggedIn,removeProfile);

module.exports=router;