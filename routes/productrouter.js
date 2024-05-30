const express = require("express")
const router = express.Router()
const mongoose = require("mongoose");
const fs = require("fs");
const formidableMiddleware = require('express-formidable');
const { default: slugify } = require("slugify");
var braintree = require("braintree");
const productSchema = require("../models/Product");
// const checklogin = require("../helpers/authjwt");

const categorySchema = require("../models/Category");
const orderSchema = require("../models/Order");


const Product = new mongoose.model("Product", productSchema);
const Order= new mongoose.model("Order",orderSchema);
//payment getway:-
var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: "vsn2f5v26psz6cqh",
    publicKey: "8fpgfsbgcccv7qpg",
    privateKey: "2f66eac7511f63883ebfcdd8300473a2",
  });
  //payment getway:-
//successfully done the create router:
router.post("/create-product",formidableMiddleware(), async(req, res) => {
// console.log(req)
    const { name, description, price,brand,category } = req.fields;
    const { photo } = req.files;
    switch (true) {
        case !name:
            return res.status(500).send({ error: "name is requried" });
        case !category:
            return res.status(500).send({ error: "category is requried" });
        case !description:
            return res.status(500).send({ error: "description is requried" });
         case !price:
            return res.status(500).send({ error: "price is requried" });
         case !brand:
            return res.status(500).send({ error: "brand requried" });

        case photo && photo.size > 2000000:
            return res.status(500).send({ error: "photo is requried and should be lezz than 1mb" });

    } 
    const products= new Product({ ...req.fields, slug: slugify(name) })
    if (photo) {
        products.photo.data = fs.readFileSync(photo.path)
        products.photo.contentType = photo.type
    }
await products.save() 
res.status(201).send({
    success:true,
    message:"Product created successfully",
    products
})
if (!products)
    return res.status(400).send({
success:false,
message:"products is not created"
})
});


//get data from db :-
router.get("/get-product", async (req, res) => {
    const products = await Product.find().populate("category", "name").select('-photo').sort("-createdAt")
    const countProducts=await Product.countDocuments({})
    
        res.send({products,countProducts})
  
});

//getting photo:- Api is okay
router.get("/product-photo/:id", async (req, res) => {

    try {
        const productPhoto = await Product.findById(req.params.id).select("photo")
        if (productPhoto.photo.data) {
            res.set('Content-Type', productPhoto.photo.contenttype)
            return res.status(201).send(productPhoto.photo.data)
        }

    }
    catch (error) {
        res.send({
            error: error,
            message: "there is an error"
        })
    }
});
//search from db by key api is done:-
router.get("/search/:keyword", async (req, res) => {
    const{ keyword } = req.params

    let data = await Product.find({
        $or: [
            { name: { $regex: keyword, $options: "i" } },
             { description: { $regex: keyword, $options: "i" } }
        ]
    }).select("-photo")
    
    res.status(201).send({
        success:true,
        data:data
    })




});
//filtering by category
router.get("/product-category/:slug", async (req, res) => {
    try {
        const value = req.params.slug

        const category = await Category.findOne({ slug: value });

        const products = await Product.find({ category }).populate("category")

        res.send({ products, category })

    }

    catch (error) {
        console.log(error)
    }




})
// Get single product api is done.
router.get("/get-singleproduct/:id", async (req, res) => {
    try {
        const id = req.params.id
        const product = await Product.findOne({ _id: id }).populate("category");
        res.status(200).send({
            message: "single producr feched",
            success: true,
            product
        })
        if (!product){
           res.status(400).send({
            message:"there is a problem"
           })
        }

    }

    catch (error) {
        console.log(error)
    }
})
//related products  api is done:
router.get("/related-products/:pid/:cid", async (req, res) => {
    try {
        const {pid,cid}=req.params
        console.log(pid,cid)
        const products = await Product.find(
          {  category:cid,
            _id:{ $ne:pid }
        }).populate("category")
        res.status(200).send({
            message: "related products feched",
            success: true,
            products
        })

    }

    catch (error) {
        
       console.log(error)
      
    }
})

//filtyering by price and category

router.post("/product-filter", async (req, res) => {
    try {

        const { checked, radio} = req.body
       

        let args = {}

        if (checked.length > 0) args.category = checked
        // if (subId.length > 1) args.subcategory = subId
        if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] }
        const products = await Product.find(args).populate("category ")
        res.status(200).send({
            success: true,
            products
        })
    }
    catch (error) {
        res.send({
            message: "filtering error"
        })
    }
})

//update data into db :
router.put("/:id", async (req, res) => {
    const product = await Product.findByIdAndUpdate({ _id: req.params.id },
        { subcategory: req.body.subcategory },
        { useFindAndModidy: false }

    )


    console.log(product)
    res.send(product)

});

// deldete data from db is done :-
router.delete("/delete-product/:id", async (req, res) => {
    const product= await Product.deleteOne({ _id: req.params.id }

    )

    res.status(201).send({
        message:"successfully deleted the course",
        product,
        success:true
    })

});
//payment 
//get token
router.get("/brainTree/token",async(req,res)=>{
    try{
        gateway.clientToken.generate({}, function(err,response){
            if(err){
                res.status(500).send(err)
            }
            else{
                res.send(response)
            }
        })
    }
    catch(err){
        console.log(err)
    }
});
//payment getway router
router.post("brainTree/payment",async(req,res)=>{
    try{
   const {cart,nonce}=req.body;
   let total=0
   cart.map((i)=>{
    total=total +i.price
   })

   let newTransation=gateway.transaction.sale({
    amount:total,
    paymentMethodNonce:nonce,
    options: {
        submitForSettlement: true,
      },
   },
   function (error,result){
if(result){
    const order=new Order({
        products:cart,
        payment:result,
        buyer:req.user._id

    }).save()
    res.json({ok:true})
}
else{
    res.status(500).send(error)
}
}
)
    }
    catch(err){
        console.log(err)
    }
})
module.exports = router;
