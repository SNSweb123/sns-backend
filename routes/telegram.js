import express from "express";

const router = express.Router();

router.post("/webhook", (req,res)=>{

  console.log("🔥 TELEGRAM WEBHOOK HIT");
  console.log(req.body);

  return res.status(200).send("OK");

});

export default router;