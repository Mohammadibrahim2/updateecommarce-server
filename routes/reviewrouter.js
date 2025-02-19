const express = require("express")
const router = express.Router();
const mongoose = require("mongoose");
const fs = require("fs");
const formidableMiddleware = require('express-formidable');
const productSchema = require("../models/Product");
const checklogin = require("../helpers/authjwt");
const isAdmin = require("../helpers/isAdmin");
const userSchema = require("../models/User");
const categorySchema = require("../models/Category");
const reviewSchema = require("../models/Review");
const { ObjectId } = require("mongodb");


const Product = new mongoose.model("Product", productSchema);
const User= new mongoose.model("User",userSchema);
const Review= new mongoose.model("Review",reviewSchema);


//create a review :-


router.post("/create-review",checklogin,formidableMiddleware(), async(req, res) => {
   
        const { products, description,user  } = req.fields;
        const review= new Review({ ...req.fields })
    await review.save() 
    res.status(201).send({
        success:true,
        message:"Your Review is Created Successfully !",
    })

    if (!review)
        return res.status(400).send({
    success:false,
    message:"Review  is not created"
    })
    });
//create a review:-
//get all reviews:-
router.get("/get-reviews",checklogin,isAdmin, async(req,res)=>{
   try{
    const { authorization}=req.headers
    const review = await Review.find().populate("products","name").populate("user","firstName").select('-photo').sort("-createdAt")
       
    res.status(200).send({
        message:"all reviews",
        ssccess:true,
        review:review
    })
   }
   catch(err){
console.log(err)
   }
     
});
//get all reviews by product id:-
//get data from db :-
router.get("/get-reviews/:id", async (req, res) => {
try{
        
    const reviews= await Review.find({products:req.params.id}).populate("products","name").populate("user","firstName").select('-photo').sort("-createdAt")

    
     res.send(reviews)
}
catch(err){
    console.log(err)
}
  
});
//Deleting an order:-
router.delete("/delete-review/:id",checklogin,isAdmin, async (req, res) => {
    const delatedReview= await Review.deleteOne({ _id: req.params.id }

    )

    res.status(201).send({
        message:"successfully deleted the order",
    
        success:true
    })

});



//get all orders:-
router.get("/",async(req,res)=>{
    
    const review=await Review.find() 
    res.send(review)
})


module.exports = router;