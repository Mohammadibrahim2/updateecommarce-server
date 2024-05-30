const mongoose=require("mongoose")

const categorySchema=mongoose.Schema({
    name:{
        type:String,
        requried:true
        
    },
    slug:{
        type:String,
        requried:true
    },

    createdAt:{
        type: Date, 
        required: true, 
        default: Date.now
    },
})

module.exports=categorySchema;