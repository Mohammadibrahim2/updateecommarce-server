const mongoose = require('mongoose');

const userSchema= mongoose.Schema({
    firstName:{
        type:String,
        
    },
    lastName:{
        type:String,
        
    },
    email:{
        type:String,
        required:true
      
    },
    adress:{
        type:String,
        required:true
      
    },
    passwordHash:{
        type:String,
        required:true
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
  
    createdAt:{
        type: Date, 
        required: true, 
        default: Date.now
    },
    phone:{
        type:Number
    },
   

   
})
module.exports=userSchema