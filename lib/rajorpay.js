import Rajorpay from "razorpay";

export const razorpay=new Rajorpay({
    key_id:process.env.RAJORPAY_KEY_ID,
    key_secret:process.env.RAJORPAY_KEY_SECRET
})