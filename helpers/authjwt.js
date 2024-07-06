const jwt=require("jsonwebtoken")
const checklogin=(req,res,next)=>{
    const {authorization}=req.headers
    try{
        const token=authorization.split(' ')[1]
        const decoded=jwt.verify(token,process.env.SECRET)
         const {userEmail,userId,isAdmin}=decoded
         
         req.userEmail=userEmail
         req.userId=userId;
         req.isAdmin=isAdmin
      
         next();
    }
    catch(err){
       res.status(404). next("Authentication failed")
    }
}
module.exports = checklogin;