const mongoose = require('mongoose');

const productSchema= mongoose.Schema({
    name:{
        type:String,
        
    },
    price:{
        type:Number,
    },
    description:{
        type:String
    },
   
    brand:{
        type:String
    },
    slug: {
        type: String,
        required: true
    },
    category:{
        type:mongoose.ObjectId,
        ref:"Category",
        required:true
    },
    // countInStock:{
    // type:Number
    // },
    // createdAt:{
    //     type: Date, 
    //     required: true, 
    //     default: Date.now
    // },
    // rating:{
    //     type:Number
    // },
    photo: {
        data: Buffer,
        contentType: String

    },
    // subcategory:{
    //     type:mongoose.ObjectId,
    //     ref:"SubCategory",
    //     required:true
    // }

   
})

productSchema.virtual('id').get(function (){
    return this._id.toHexString();

});
productSchema.set('toJSON',{
    virtuals:true
})


module.exports=productSchema;