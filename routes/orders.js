import express from 'express';
import Order from '../models/Order.js';
import { v4 as uuidv4 } from "uuid";
import { sendTelegramMessage } from "../services/botservice.js";

const router = express.Router();



router.get("/telegram-test", async (req,res)=>{

  await sendTelegramMessage(
    "✅ Telegram connection test successful"
  );

  res.json({
    message:"Telegram test done"
  });

});





// CREATE NEW ORDER
router.post('/', async (req, res) => {
  try {
   
 const generatedOrderId = `ORD-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

     
    const {
       items,
      totalPriceINR,
      totalPriceUSDT,
      fullName,
      email,
      phone,
    } = req.body;

    if (!fullName || !email || !phone) {
      return res.status(400).json({
        message: 'Missing required fields'
      });
    }

if (!items || !Array.isArray(items) || items.length === 0) {
  return res.status(400).json({ message: "Cart empty" });
}

if (!totalPriceINR || isNaN(totalPriceINR) || totalPriceINR <= 0) {
  return res.status(400).json({ message: "Invalid total price" });
}

    const newOrder = new Order({
      orderId: generatedOrderId,
      items,
      totalPriceINR,
      totalPriceUSDT,
      fullName,
      email,
      phone,
      status: "pending"
    });

    await newOrder.save();

    res.status(201).json({
      message: 'Order saved successfully',
        orderId: generatedOrderId,  
      order: newOrder
    });

  } catch (error) {
    console.error("ORDER ERROR:", error);

    res.status(500).json({
      message: 'Failed to save order'
    });
  }
});


// GET ALL ORDERS
router.get("/", async (req, res) => {

  try {

    const filter = {};

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const orders = await Order.find(filter).sort({
      createdAt: -1
    });

    res.json(orders);

  } catch (error) {

    res.status(500).json({
      message: "Failed"
    });

  }

});

router.put("/decision", async (req, res) => {
  try {
    const { orderId, action } = req.body;

    await Order.findByIdAndUpdate(orderId, {
      status: action // accepted / rejected
    });

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// MARK AS PAID (USER CLICK)
router.put("/mark-paid", async (req, res) => {

  try {

    const { orderId } = req.body;

    const order = await Order.findOne({
      orderId
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    order.status = "pending";

    await order.save();



   await sendTelegramMessage(
`
🔥 New Payment Received

🆔 Order ID:
${order.orderId}

👤 Name:
${order.fullName}

📧 Email:
${order.email}

📱 Phone:
${order.phone}

💰 Amount:
₹${order.totalPriceINR}

📦 Products:

${order.items.map(
(item)=>
`${item.productName} x ${item.quantity}`
).join("\n")}


⏳ Waiting For Approval
`,
order.orderId
);


    res.json(order);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

});

router.put('/status', async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const order = await Order.findOneAndUpdate(
      { orderId },
      { status },
      { new: true }
    );

    res.json(order);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/update-status", async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const order = await Order.findOne({ orderId }); // 🔥 FIX

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.json({ success: true, order });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:orderId", async (req, res) => {

  try {

    const order = await Order.findOne({
      orderId: req.params.orderId
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    res.json(order);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

});


export default router;