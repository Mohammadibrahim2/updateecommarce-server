const express =require("express")
const router =express.Router()
const mongoose= require("mongoose");
const userSchema = require("../models/User");
const bcrypt =require('bcryptjs')
const jwt =require('jsonwebtoken');
const dotenv =require("dotenv")
// const checklogin = require("../helpers/authjwt");

dotenv.config()
 const User= new mongoose.model("User",userSchema);

//create user into db:-
router.post("/register",async(req,res)=>{
   
    try{
        let user = User({
            firstName:req.body.firstName,
            lastName:req.body.lastName,
            email:req.body.email,
            phone:req.body.phone,
            passwordHash:bcrypt.hashSync(req.body.password,10),
            isAdmin:req.body.isAdmin
         })
         
            newuser=await user.save()
            if(!newuser)
             return res.status(400).send("the user can not be created")
      
          let registedUser= newuser
          res.status(201).send(registedUser)
          
    }

    catch(error){
        res.send(error)
    }
   
   });
   

//get data from db :-
router.get("/",  async(req,res)=>{
    const user = await User.find().select("-passwordHash").sort({createdAt:-1})
       
    res.send(user)
     
});

//search from db by key:-
router.get("/own",async(req,res)=>{

    // const user = await User.find(
    //     {email:req.body.email}
    // ).select('-passwordHash')
   
    //    console.log(user)
    // res.send(user)
     
});

//admin

router.get("/admin/:email",async(req,res)=>{
    const email=req.params.email
    const user= await User.findOne({email})
  
    isFinite(user.isadmin===true)
    res.send({"isAdmin":user.isAdmin})
})
//update data into db api is done :
router.put("/update/:id",async(req,res)=>{
console.log(req.params.id)
console.log(req.body)
    const {firstName,lastName,email,password,phone}=req.body;
    const user=await User.findById(req.params.id)
    //password
    if(password && password.length<6){
        return res.json({error:"password is required and 6 character long"})
    }
    const passwordHash=password?  bcrypt.hashSync(password,10):undefined;
    const updatedUser=await User.findByIdAndUpdate(req.params.id,{
        firstName:firstName || user.firstName,
        lastName:lastName|| user.lastName,
        password:passwordHash|| user.password,
        phone:phone|| user.phone,
        email:email|| user.email
        
    },{new:true})
    console.log(updatedUser)
    res.status(200).send({
        success:true,
        message:"Profile updated successfully",
        updatedUser
        
    })
    
     
   
     
});

//delete data from db :-
router.delete("/:id",async(req,res)=>{
 
    const user = await User.deleteOne({_id:req.params.id}
       
    )
    
    res.send({
        success:true,
        message:"successfully deleted user",
        user
        
    })
     
});
//for login user api is done:-

router.post('/login',async(req,res)=>{
    
    const secret=process.env.SECRET
    try{
        const {email,password}=req.body
        //validation:
        if(!email || !password){
            return res.status(404).send({
                success:false,
                message:"Invalied email or password"
            })
        }


        const user= await User.findOne({email:email})
        
        if(!user){
            return res.status(400).send({
                success:false,
                message:"Invalied email "
            })
        }
        const match=await user && bcrypt.compareSync(password,user.passwordHash)
        if(!match){  
            return res.status(200).send({
                success:false,
                message:"Invalied Password"
            })
        }
           
        const token= await jwt.sign(
                {
                    userId:user._id,
                    userEmail:user.email,
                    isAdmin:user.isAdmin
                    
                },
                secret,
                {expiresIn:'1h'}
            )
            return res.status(200).send(
                {
                success:true,
                 message:"Login successfully",
                user:{
                    firstName:user.firstName,
                    lastName:user.lastName,
                    email:user.email,
                    phone:user.phone,
                    _id:user._id
                   

                }
                ,token:token})
      
        
    }
    catch(error){
        console.log(error)
    }
   
   

})
module.exports=router;
