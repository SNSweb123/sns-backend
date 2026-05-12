import express from 'express';
import Order from '../models/Order.js';
import GiftVoucherProduct from "../models/GiftVoucherProduct.js";


const router = express.Router();



// CREATE NEW ORDER
router.post('/', async (req, res) => {
  try {
    let deliveredCodes = [];
    const {
      orderId,
      items,
      totalPriceINR,
      totalPriceUSDT,
      fullName,
      email,
      phone,
    } = req.body;

    if (!orderId || !fullName || !email || !phone ) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!items || items.length === 0 || totalPriceINR <= 0) {
      return res.status(400).json({ message: 'Invalid order data' });
    }


for (const item of items) {

  // only gift voucher
  if (item.productType === "gift-voucher") {

    const product =
      await GiftVoucherProduct.findById(item.productId);

    if (!product) continue;

    // unused code
    const availableCode =
      product.couponCodes.find(c => !c.isUsed);

    // no codes left
    if (!availableCode) {

      return res.status(400).json({
        message: `No codes left for ${product.name}`
      });
    }

    // used mark
    availableCode.isUsed = true;

    await product.save();

    // customer ko dene ke liye
    deliveredCodes.push({
      productName: product.name,
      code: availableCode.code
    });
  }
}



   const newOrder = new Order({
  orderId,
  items,
  totalPriceINR,
  totalPriceUSDT,
  fullName,
  email,
  phone,
  deliveredCodes,
});

    await newOrder.save();

    res.status(201).json({
      message: 'Order saved successfully',
      order: newOrder,
       deliveredCodes
      
    });

  } catch (error) {
    console.error("ORDER ERROR:", error);
    res.status(500).json({ message: 'Failed to save order' });
  }
});

// GET ALL ORDERS
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error });
  }
});

export default router;
