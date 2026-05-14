import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import ordersRouter from '../routes/orders.js';
import productRoutes from '../routes/products.js';
import Product from '../models/Product.js';
import uploadRoutes from "../routes/upload.js";
import newsletterRoutes from "../routes/newsletterRoutes.js";
import paymentRoutes from "../routes/payment.js";
import adminRoutes from "../routes/admin.js";

import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


// ✅ Debug ENV
console.log(
  "MONGODB_URI:",
  process.env.MONGODB_URI ? "FOUND" : "MISSING"
);


// ✅ MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  console.log("MongoDB Connected");
})
.catch((err) => {
  console.log("MongoDB Error:", err);
});


// ✅ Test Route
app.get("/", (req, res) => {
  res.send("Backend Running 🚀");
});


// ✅ Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', ordersRouter);
app.use("/api/upload", uploadRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);


// ✅ Admin Route
app.get('/api/admin/products', async (req, res) => {

  try {

    const products = await Product.find();

    res.json(products);

  } catch (error) {

    console.error("Admin Products Error:", error);

    res.status(500).json({
      error: error.message
    });
  }
});


// ✅ Export App
export default app;