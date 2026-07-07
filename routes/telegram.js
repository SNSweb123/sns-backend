import express from "express";
import Order from "../models/Order.js";

const router = express.Router();


router.post("/webhook", async (req, res) => {

  console.log("🔥 TELEGRAM WEBHOOK HIT");

  res.status(200).json({
    success:true
  });

  try {

    const data = req.body;

    const callback = data.callback_query;

    if(!callback){
      return;
    }

    const action = callback.data;

    const [status, orderId] = action.split("_");


    const order = await Order.findOne({
      orderId
    });


    if(!order){
      return;
    }


    if(status === "approve"){
      order.status = "approved";
    }


    if(status === "reject"){
      order.status = "rejected";
    }


    await order.save();


  } catch(error){

    console.log(error);

  }

});


export default router;