const jwt=require("jsonwebtoken");

function isLoggedIn(req,res,next){
    try{
        const token=req.cookies.token;
        if(!token){
            return res.status(401).json({
                success:false,
                message:"No token, auth denied"
            });
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.user=decoded;
        return next();
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Something went wrong",
            error:err.message
        });
    }
}

module.exports=isLoggedIn;