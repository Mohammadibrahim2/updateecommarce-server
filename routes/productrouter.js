 express = require("express")
const router = express.Router()
const mongoose = require("mongoose");
const fs = require("fs");
const formidableMiddleware = require('express-formidable');
const { default: slugify } = require("slugify");

const SSLCommerzPayment = require('sslcommerz-lts')
const productSchema = require("../models/Product");
// const checklogin = require("../helpers/authjwt");
const feturedcategorySchema= require('../models/FeaturedCategory')
const categorySchema = require("../models/Category");
const orderSchema = require("../models/Order");
const { ObjectId } = require("mongodb");


const Product = new mongoose.model("Product", productSchema);
const Order= new mongoose.model("Order",orderSchema);
const Category= new mongoose.model("Category",categorySchema);
const FeaturedCategory= new mongoose.model("FeaturedCategory", feturedcategorySchema);

//payment getway:-
const store_id = 'fishn66771ca59bfab'
const store_passwd = 'fishn66771ca59bfab@ssl'
const is_live = false //true for live, false for sandbox
  //payment getway:-

//successfully done the create router:
router.post("/create-product",formidableMiddleware(), async(req, res) => {
// console.log(req)
    const {  quantity,name, description, price,brand,category,featuredCategory} = req.fields;
    const { photo } = req.files;
    switch (true) {
        case !name:
            return res.status(500).send({ error: "name is requried" });
        case !category:
            return res.status(500).send({ error: "category is requried" });
        case !featuredCategory:
            return res.status(500).send({ error: "featuredCategory is requried" });
        case !description:
            return res.status(500).send({ error: "description is requried" });
         case !price:
            return res.status(500).send({ error: "price is requried" });
         case !brand:
            return res.status(500).send({ error: "brand requried" });
         case !quantity:
            return res.status(500).send({ error: "quantity requried" });

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
router.get("/get-featured-products/:slug", async (req, res) => {
    try {
        const value = req.params.slug

    

        const featuredCategory = await FeaturedCategory.findOne({ slug: value });

        const products = await Product.find({ featuredCategory}).populate("featuredCategory").select('-photo')

        res.send({ products, featuredCategory })

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
//get featured product:-
router.get("/featured-product/:slug",async(req,res)=>{
    
    try {
        const value=req.params.slug
   
        const feturedCategory = await FeaturedCategory.findOne({ slug: value })
        const products = await Product.find({feturedCategory}).populate("feturedCategory")

        res.send({ products, feturedCategory })

    }

    catch (error) {
        console.log(error)
    }

})
//payment 
//get token
router.post("/order",async(req,res)=>{
    const tran_id=new ObjectId().toString()

    try{
        const {cart,user,wholePrice}=req.body;
        
       
        let total=0
        cart.map((i)=>{
         total=total +i.price
        })
        const data = {
            total_amount: wholePrice,
            currency: 'BDT',
            tran_id: tran_id, // use unique tran_id for each api call
            success_url: `https://updateecommarce-server.vercel.app/product/payment/success/${tran_id}`,
            fail_url: 'http://localhost:3030/fail',
            cancel_url: 'http://localhost:3030/cancel',
            ipn_url: 'http://localhost:3030/ipn',
            shipping_method: 'Courier',
            product_name: 'Computer.',
            product_category: 'Electronic',
            product_profile: 'general',
            cus_name: user?.firstName,
            cus_email: user?.email,
            cus_add1: user?.adress,
            cus_add2: 'Dhaka',
            cus_city: 'Dhaka',
            cus_state: 'Dhaka',
            cus_postcode: '1000',
            cus_country: 'Bangladesh',
            cus_phone: user?.phone,
            cus_fax: '01711111111',
            ship_name: 'Customer Name',
            ship_add1: 'Dhaka',
            ship_add2: 'Dhaka',
            ship_city: 'Dhaka',
            ship_state: 'Dhaka',
            ship_postcode: 1000,
            ship_country: 'Bangladesh',
        };

       
      
        const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)
        sslcz.init(data).then(apiResponse => {
            // Redirect the user to payment gateway
            let GatewayPageURL = apiResponse.GatewayPageURL
            res.send({url:GatewayPageURL});
            //save an order:-
            const order=new Order({
                        products:cart,
                        paymetStatus:false,
                        buyer:user._id,
                        tranId:tran_id,
                        totalAmount: wholePrice,
                
                    }).save()
            
          
        });
        router.post("/payment/success/:tranId",async(req,res)=>{
         
            const order=await Order.findOne({tranId:req.params.tranId})
            const result=await Order.findByIdAndUpdate(req.params.id
                ,{
                 $set:{
                     paymetStatus:true
                    },
                   
                  },{new:true}
             ) 
      
     
      
      if(req.params.tranId){
        res.redirect(`http://localhost:3000/dashboard/users-orders/${req.params.tranId}`)
      }
    
       
        
    })
      


        

    }
    catch(err){
        console.log(err)
    }
});

//payment getway router


module.exports = router;
