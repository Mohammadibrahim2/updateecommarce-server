const express = require("express")
const router = express.Router()
const mongoose = require("mongoose");
const categorySchema= require('../models/Category')
// const checklogin = require("../helpers/authjwt");
const { default: slugify } = require("slugify");




const Category = new mongoose.model("Category", categorySchema);

router.post("/create-category",async(req,res)=>{

    const {name}=req.body
    
    console.log(name)
    
        const createdCategory= new Category({
          
          name:name,
          slug:slugify(name)
          
        })
          
           const result=await createdCategory.save()
         res.status(201).send({
          message:"successfully created a category",
          result
         })
       
       });

router.get("/get-categories",async(req,res)=>{
    
    const categories =await Category.find()

   
    res.status(201).send({
      success:true,
      message:"all categories",
      categories
    })

//deleting data:

router.delete("/delete-category/:id", async (req, res) => {
  try{
      console.log(req.params.id)
      const result= await Category.deleteOne({ _id: req.params.id }

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