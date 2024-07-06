const nodemailer =require('nodemailer')
const mg = require('nodemailer-mailgun-transport');

function sendOrderMail(user,orders){

 let items=[]
let  email=user.user.email
  console.log(user.user.email)
  let product=orders.orderItems.map(order=>items.push(order)
  
   )
   console.log("pro",items)

   let dta=items.map(item=>item.product)
  console.log(dta)
  let info={}
  let finaldata=dta.map(d=>(info.price=d.price))

console.log(info)

   const auth = {
       auth: {
         api_key: process.env.EMAIL_KEY,
         domain: process.env.EMAIL_DOMAIN
       }
     }
     
     const transporter = nodemailer.createTransport(mg(auth));
   // let transporter = nodemailer.createTransport({
   //     host: "smtp.forwardemail.net",
   //     port: 465,
   //     secure: true,
   //     auth: {
   //       // TODO: replace `user` and `pass` values from <https://forwardemail.net>
   //       user: 'REPLACE-WITH-YOUR-ALIAS@YOURDOMAIN.COM',
   //       pass: 'REPLACE-WITH-YOUR-GENERATED-PASSWORD'
   //     }
   //   });
   

transporter.sendMail({
       from:email,
       to: 'mohammadibrahim6454@gmail.com', // An array if you have multiple recipients.
       subject: 'Hey you, awesome!',
       'replyTo': 'reply2this@company.com',
       
       html: `<b>Your product price id :${info.price} </b>`,
       
       // text: 'Mailgun rocks, pow pow!'
     }, (err, infow) => {
       if (err) {
         console.log(`Error: ${err}`);
       }
       else {
         console.log(`Response: ${infow}`);
       }
     });
}
module.exports =sendOrderMail