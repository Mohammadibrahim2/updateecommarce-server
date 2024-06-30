const router = express.Router()
const mongoose = require("mongoose");
const fs = require("fs");
const formidableMiddleware = require('express-formidable');
const { default: slugify } = require("slugify");

const SSLCommerzPayment = require('sslcommerz-lts')
const productSchema = require("../models/Product");
// const checklogin = require("../helpers/authjwt");
const userSchema = require("../models/User");
const categorySchema = require("../models/Category");
const orderSchema = require("../models/Order");
const { ObjectId } = require("mongodb");


const Product = new mongoose.model("Product", productSchema);
const Order= new mongoose.model("Order",orderSchema);
const User= new mongoose.model("User",userSchema);



//get data from db :-
router.get("/get-userOrder/:id", async (req, res) => {
try{
        
    const orders= await Order.findOne({buyer:req.params.id}).populate("products","name").populate("buyer","firstName").select('-photo').sort("-createdAt")

    
        res.send({orders})
}
catch(err){
    console.log(err)
}
  
});
//Deleting an order:-
router.delete("/delete-order/:id", async (req, res) => {
   try{
    console.log(req.params.id)
    const order= await Order.deleteOne({ _id:req.params.id })
     res.status(201).send({
        message:"successfully deleted the order",
        success:true
    })
   }catch(err){console.log(err)}

});


//get all orders:-
router.get("/",async(req,res)=>{
    
    const result=await Order.find() 
    res.send(result)
})


module.exports = router;