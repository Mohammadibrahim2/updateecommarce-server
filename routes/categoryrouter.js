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
    
        const category= new  Category({
           name:name,
          slug:slugify(name)
          
        })
          
           const result=await  category.save()
         res.status(201).send(result)
       
       });

router.get("/get-categories",async(req,res)=>{
    
    const categories =await Category.find()

   
    res.status(201).send({
      success:true,
      message:"all categories",
      categories
    })



})
module.exports=router;