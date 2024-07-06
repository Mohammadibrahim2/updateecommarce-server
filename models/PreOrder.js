const { timestamps } = require('mongodb');
const mongoose = require('mongoose');

const preorderSchema= mongoose.Schema({

    name:{
        type: String,
        required:true
    },

   photo: {
    data: Buffer,
    contentType: String

},
 adress:{
    type:String,
    required:true
    
 },
 phone:{
    type:Number,
    required:true
    
 },
 email:{
    type:String,
    required:true
    
 },
 userName:{
    type:String,
    required:true
    
 }
   
});

module.exports=preorderSchema