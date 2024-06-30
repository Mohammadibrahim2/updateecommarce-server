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
    featuredCategory:{
        type:mongoose.ObjectId,
        ref:"FeaturedCategory",
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
    quantity:{
        type:Number,
        required:true
    },
    photo: {
        data: Buffer,
        contentType: String

    },
   

   
})

productSchema.virtual('id').get(function (){
    return this._id.toHexString();

});
productSchema.set('toJSON',{
    virtuals:true
})


module.exports=productSchema;