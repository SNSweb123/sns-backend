import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/Order.js";
import GiftVoucherProduct from "../models/GiftVoucherProduct.js";

const router = express.Router();


console.log(process.env.RAZORPAY_KEY_ID);
console.log(process.env.RAZORPAY_SECRET);
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});


router.post("/create-order", async (req, res) => {
  try {
const options = {
  amount: Math.round(req.body.amount * 100),
  currency: "INR",
  receipt: "rcpt_" + Date.now(),
};

    const order = await razorpay.orders.create(options);

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/verify", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      cartItems,
      formData,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body)
      .digest("hex");

    console.log("EXPECTED:", expectedSignature);
console.log("RECEIVED:", razorpay_signature);
    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment Invalid" });
    }

   const existingOrder = await Order.findOne({
  paymentId: razorpay_payment_id
});

if (existingOrder) {
  return res.json({
    success: true,
    deliveredCodes: [],
    message: "Order already processed"
  });
}


const customOrderId =
  "ORD-" +
  Date.now() +
  "-" +
  Math.floor(Math.random() * 1000);

const order = new Order({
  orderId: customOrderId,

  razorpayOrderId: razorpay_order_id,

  transactionId: razorpay_payment_id,

  items: cartItems.map(item => ({
    productId: item._id,
    productName: item.name,
    productType: item.type,
    quantity: item.quantity,
    price: item.discountedPrice
  })),

  totalPriceINR: cartItems.reduce(
    (t, i) =>
      t + i.discountedPrice * i.quantity,
    0
  ),

  fullName: formData.fullName,
  email: formData.email,
  phone: formData.phone,
});

await order.save();

  let deliveredCodes = [];

// =============================
// GIFT VOUCHER CODE DELIVERY
// =============================
for (const item of cartItems) {

  // sirf gift voucher
  if (item.type !== "gift-voucher") {
    continue;
  }

  console.log("ITEM:", item);

  const product =
    await GiftVoucherProduct.findById(item._id);

  // product not found
  if (!product) {

    console.log(
      "PRODUCT NOT FOUND:",
      item._id
    );

    continue;
  }

  // couponCodes missing
  if (
    !product.couponCodes ||
    !Array.isArray(product.couponCodes)
  ) {

    console.log(
      "NO COUPON CODES ARRAY"
    );

    continue;
  }

  // available code
  const availableCode =
    product.couponCodes.find(
      c => !c.isUsed
    );

  // no unused code
  if (!availableCode) {

    console.log(
      "NO AVAILABLE CODES"
    );

    continue;
  }

  // mark used
  availableCode.isUsed = true;

  await product.save();

  deliveredCodes.push({
    productName: product.name,
    code: availableCode.code
  });
}

res.json({
  success: true,
  deliveredCodes,
  orderId: customOrderId
});

  } catch (err) {

  console.log(
    "VERIFY ROUTE ERROR:",
    err
  );

  res.status(500).json({
    error: err.message
  });
}
});



export default router;