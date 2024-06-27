const router = express.Router()
const mongoose = require("mongoose");
const fs = require("fs");
const formidableMiddleware = require('express-formidable');

const productSchema = require("../models/Product");
// const checklogin = require("../helpers/authjwt");
const userSchema = require("../models/User");
const categorySchema = require("../models/Category");
const reviewSchema = require("../models/Review");
const { ObjectId } = require("mongodb");


const Product = new mongoose.model("Product", productSchema);
const User= new mongoose.model("User",userSchema);
const Review= new mongoose.model("Review",reviewSchema);


//create a review :-


router.post("/create-review",formidableMiddleware(), async(req, res) => {
    // console.log(req)
        const { product, description,user  } = req.fields;
        const { photo } = req.files;
 
        const review= new Review({ ...req.fields })
        if (photo) {
            review.photo.data = fs.readFileSync(photo.path)
            review.photo.contentType = photo.type
        }
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
router.get("/get-reviews",  async(req,res)=>{
    const review = await Review.find().sort({createdAt:-1})
       
    res.send(review)
     
});
//get all reviews:-
//get data from db :-
router.get("/get-userReview/:id", async (req, res) => {
try{
        
    const review= await Review.findOne({user:req.params.id}).populate("products","name").populate("user","firstName").select('-photo').sort("-createdAt")

    
        res.send({review})
}
catch(err){
    console.log(err)
}
  
});
//Deleting an order:-
router.delete("/delete-review/:id", async (req, res) => {
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