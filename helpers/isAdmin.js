
const mongoose = require('mongoose');
const jwt=require("jsonwebtoken")
const userSchema = require("../models/User");
const User= new mongoose.model("User",userSchema);
const isAdmin=async(req,res,next)=>{
    const {authorization}=req.headers
    try{
      const token=authorization.split(' ')[1]
        const decoded=jwt.verify(token,process.env.SECRET)
         const {userEmail,userId,isAdmin}=decoded
         
         req.userId=userId;
         req.isAdmin=isAdmin

         
      const user= await User.findById(req.userId)
      if(user.isAdmin!==true){
        return res.status(401).send({
          success:false,
          message:"UnAthurized Access"
        })
      }
      else{
     next();
      }

      
    }
    catch(err){ console.log(err)
       res.status(404).send({
        success:false,
       
        message:"Error in admin middleware"
       })
    }
}
module.exports = isAdmin;
