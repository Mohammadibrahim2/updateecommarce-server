const { timestamps } = require('mongodb');
const mongoose = require('mongoose');

const orderSchema= mongoose.Schema({

    products:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true
    }],

   buyer:{
    type: mongoose.Schema.Types.ObjectId,
        ref:"User",
   },
//    status:{
//     type:String,
//     default:"Not Process",
//     enum:["Not process","Processing","Shipped","Delivered","Cancel"]
//    },
   
   paymetStatus:{
    type:Boolean,
    
},
   
   totalAmount:{
    type:Number,
    
},
tranId:{
    type:String
}
   
});
orderSchema.virtual('id').get(function (){
    return this._id.toHexString();

});
orderSchema.set('toJSON',{
    virtuals:true
})
module.exports=orderSchema