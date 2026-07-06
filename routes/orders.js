import express from 'express';
import Order from '../models/Order.js';
import { v4 as uuidv4 } from "uuid";

const router = express.Router();


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
router.get('/', async (req, res) => {
  try {

    const orders =
      await Order.find().sort({ createdAt: -1 });

    res.json(orders);

  } catch (error) {

    res.status(500).json({
      message: 'Failed to fetch orders',
      error
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
router.put('/mark-paid', async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findOneAndUpdate(
      { orderId },
      { status: "paid" },
      { new: true }
    );

    res.json(order);

  } catch (err) {
    res.status(500).json({ message: err.message });
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

    const order = await Order.findById(orderId);

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

export default router;