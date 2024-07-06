const express = require("express")
const router = express.Router()
const mongoose = require("mongoose");
const preorderSchema =require("../models/PreOrder")
const checklogin = require("../helpers/authjwt");
const isAdmin = require("../helpers/isAdmin");
const { default: slugify } = require("slugify");
const formidableMiddleware = require('express-formidable');
const fs = require("fs");

const PreOrder = new mongoose.model("PreOrder",preorderSchema);

router.post("/create-preorder",checklogin,formidableMiddleware(), async(req, res) => {

    const { name,userName,email,phone,adress} = req.fields;
    const { photo } = req.files;
    switch (true) {
        case !name:
            return res.status(500).send({ error: "name is requried" });
        case !userName:
            return res.status(500).send({ error: "userName is requried" });
        case !phone:
            return res.status(500).send({ error: "phone is requried" });
        case !email:
            return res.status(500).send({ error: "email is requried" });
         case !adress:
            return res.status(500).send({ error: "adress is requried" });
        

        case photo && photo.size > 2000000:
            return res.status(500).send({ error: "photo is requried and should be lezz than 1mb" });

    } 
    const preorder= new PreOrder({ ...req.fields, slug: slugify(name) })
    if (photo) {
        preorder.photo.data = fs.readFileSync(photo.path)
        preorder.photo.contentType = photo.type
    }
await preorder.save() 
res.status(201).send({
    success:true,
    message:"preorder created successfully",
    preorder
})
if (! preorder)
    return res.status(400).send({
success:false,
message:"preorder is not created"
})
});

router.get("/admin/get-preorder",checklogin,isAdmin,async(req,res)=>{
    
    const preorders =await PreOrder.find()

   
    res.status(201).send({
      success:true,
      message:"all preorders",
      preorders
    })
//preorder photo
router.get("/preorder-photo/:id", async (req, res) => {

    try {
        const preorderPhoto = await PreOrder.findById(req.params.id).select("photo")
        if (preorderPhoto.photo.data) {
            res.set('Content-Type', preorderPhoto.photo.contenttype)
            return res.status(201).send(preorderPhoto.photo.data)
        }

    }
    catch (error) {
        res.send({
            error: error,
            message: "there is an error"
        })
    }
});

//deleting data:

router.delete("/delete-preorder/:id",checklogin,isAdmin, async (req, res) => {
  try{
      console.log(req.params.id)
      const result= await PreOrder.deleteOne({ _id: req.params.id }

      )
  
      res.status(201).send({
          message:"successfully deleted the PreOrder",
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