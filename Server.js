const express=require("express")
const dotenv =require("dotenv")
const cors=require('cors')

const mongoose = require('mongoose');
const port= 8000
const app=express()

// const checkLogin =require("./middlewares/checklogin")
// const { MongoClient, ServerApiVersion} = require('mongodb');




// const bcrypt =require("bcrypt")

const jwt =require("jsonwebtoken")


// const userSchema=require("./models/User.js")

// const User= new mongoose.model("User",userSchema)
 //mohammadibrahim6454
        //Bm0asUCcjBmEPbKl
 app.use(cors())
dotenv.config()
app.use(express.json())





const productRouter=require("./routes/productrouter");
const orderRouter=require("./routes/orderrouter");
const userRouter=require("./routes/userrouter");
const categoryRouter=require("./routes/categoryrouter");
// const subcategoryRouter=require("./routes/subcategoryrouter");

// const authJwt = require("./helpers/authjwt");
// app.use(authJwt)

//connection withe db:-

const uri ="mongodb+srv://mohammadibrahim6454:Bm0asUCcjBmEPbKl@cluster0.25qr4ok.mongodb.net/test"


// const client = new MongoClient(uri, { useNewUrlParser: true,
//     useUnifiedTopology: true, 
//     serverApi: ServerApiVersion.v1 });
 
mongoose.set("strictQuery", true);
mongoose.connect(uri,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
  .then(() => console.log('connection sucessful'))
  .catch((err)=>console.log(err));

//connection withe db:---------------

async function run(){
    
        try{ 
// start ecommarce:




app.use("/product",productRouter)
app.use("/order",orderRouter)
app.use("/user",userRouter)
app.use("/category",categoryRouter)
// app.use("/subcategory",subcategoryRouter)





//send sode of ecommarce:-
 
        
      }
      finally{

      }
    

  

}
run().catch(console.dir)




const errorHandler =(err,req,res,next)=>{
    if(res.headersSent){
        return next(err);
    }
    res.status(401).json({
        error:err
    })
}

app.use(errorHandler)



app.listen(port,()=>{
    console.log(port,"port")

});
