import express from "express";
import Order from "../models/Order.js";

const router = express.Router();


router.post("/webhook", async(req,res)=>{

try {

console.log("TELEGRAM DATA:", req.body);


const callback = req.body.callback_query;


if(!callback){
    return res.sendStatus(200);
}


const action = callback.data;


const [status, orderId] = action.split("_");


console.log("STATUS:",status);
console.log("ORDER ID:",orderId);



const order = await Order.findOne({
    orderId: orderId
});


console.log("FOUND ORDER:",order);



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


console.log(
"UPDATED STATUS:",
order.status
);


res.sendStatus(200);



}catch(error){

console.log(
"WEBHOOK ERROR:",
error
);

res.sendStatus(500);

}


});


export default router;