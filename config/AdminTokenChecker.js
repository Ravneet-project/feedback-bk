const jwt=require("jsonwebtoken")
const PVT_KEY="feedback"
module.exports=(req,res,next)=>{
    let token=req.headers.authorization
    if(!token){
        res.json({
            success:false,
            status:403,
            message:"token not found"
        })
    }else{
        jwt.verify(token,PVT_KEY,function(err,decoded){
            if(!!err){
                res.json({
                    status:403,
                    success:false,
                    message:"unauthorised access"
                })
            }else{
                if(decoded.userType==1){
                    req.decoded=decoded 
                    next()
                }else{
                    res.json({
                        status:403,
                        success:false,
                        message:"you are not allowed to access this page"
                    })
                }
            }
        })
    }

}