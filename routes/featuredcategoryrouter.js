const express = require("express")
const router = express.Router()
const mongoose = require("mongoose");
const feturedcategorySchema= require('../models/FeaturedCategory')
// const checklogin = require("../helpers/authjwt");
const { default: slugify } = require("slugify");




const FeaturedCategory= new mongoose.model("FeaturedCategory", feturedcategorySchema);

router.post("/create-featured-category",async(req,res)=>{

    try{
        const {name}=req.body
    console.log(name)
    
        const fcategory= new  FeaturedCategory({
           name:name,
          slug:slugify(name)
          
        })
          
           const result=await  fcategory.save()
         res.status(201).send(result)
    }
    catch(err){
        res.send(err)
        consoel.log(err)
    }
       
       });
//get all featured categriy:-
router.get("/get-fetured-categories",async(req,res)=>{
    
    const fcategories =await FeaturedCategory.find()

   
    res.status(201).send({
      fcategories,
      success:true
    })

//get products by single category:-

    //delete fetcategy

router.delete("/delete-featured-category/:id", async (req, res) => {
    try{
        console.log(req.params.id)
        const result= await FeaturedCategory.deleteOne({ _id: req.params.id }

        )
    
        res.status(201).send({
            message:"successfully deleted the featured category",
            result,
            success:true
        })
    }
    catch(err){
        res.send(err)
        console.log(err)
    }

});


})
module.exports=router;