const { timestamps } = require('mongodb');
const mongoose = require('mongoose');

const reviewSchema= mongoose.Schema({

    products:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true
    },

   user:{
    type: mongoose.Schema.Types.ObjectId,
        ref:"User",
   },

   
 description:{
    type:String,
    
 }
   
});
reviewSchema.virtual('id').get(function (){
    return this._id.toHexString();

});
reviewSchema.set('toJSON',{
    virtuals:true
})
module.exports=reviewSchema