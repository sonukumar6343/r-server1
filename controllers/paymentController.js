import crypto from "crypto";
import Razorpay from "razorpay";
import {Bill} from "../models/bill.js"
export const processPayment = async (req, res) => {
  const options = {
    amount: Number(req.body.amount * 100),
    currency: "INR",
  };
  const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,
  });

  const order = await instance.orders.create(options);
  res.status(200).json({
    success: true,
    order,
  });
};


export const sendRazorpayApiKey= async(req,res)=>{
  res.status(200).json({
      key:process.env.RAZORPAY_API_KEY
  })  
}
// export const paymentVerification = async(req,res)=> {
//   console.log(req.body);
//   const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
//     req.body;

//     console.log("razorpay_signature",razorpay_signature)

//   const body = razorpay_order_id + "|" + razorpay_payment_id;
//   const expectedSignature = crypto
//     .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
//     .update(body.toString())
//     .digest("hex");

//     console.log("expectedSignature:",expectedSignature)

//   const isAuthentic = expectedSignature===razorpay_signature;
//   console.log("isAuthentic",isAuthentic);
//   const CLIENT_URL = process.env.CLIENT_URL;
//   if (isAuthentic) {
//     return res.redirect(
//       `${CLIENT_URL}/paymentSuccess?reference=${razorpay_payment_id}`
//     );
//   } else {
//     res.status(400).json({
//       success: false,
//     });
//   }
//   res.status(200).json({
//     success: true,
//   });
// };

export const paymentVerification = async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature} = req.body;
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const orderId = req.params.id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
    .update(body.toString())
    .digest("hex");
  const isAuthentic = expectedSignature === razorpay_signature;
  const CLIENT_URL = process.env.CLIENT_URL;
  if (isAuthentic) {
    if(orderId){
      await Bill.findByIdAndUpdate(orderId, {
        "paymentInfo.transactionId": razorpay_payment_id,
        "paymentInfo.status": "Completed",
      });
    }
    return res.redirect(`${CLIENT_URL}/paymentSuccess?reference=${razorpay_payment_id}`);
  } 

  // If authentication fails, send a response and return to prevent further execution.
  return res.status(400).json({ success: false });
};