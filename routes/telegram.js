import express from "express";
import Order from "../models/Order.js";

const router = express.Router();


router.post("/webhook", async(req,res)=>{

try {

const data = req.body;


// Telegram button click data
const callback = data.callback_query;

if(!callback){
    return res.sendStatus(200);
}


const action = callback.data;


// approve_ORD123
const [status, orderId] = action.split("_");


const order = await Order.findOne({
    orderId
});


if(!order){
    return res.sendStatus(200);
}


if(status === "approve"){

    order.status="approved";

}


if(status === "reject"){

    order.status="rejected";

}


await order.save();



res.sendStatus(200);



}catch(error){

console.log(error);

res.sendStatus(500);

}


});


export default router;