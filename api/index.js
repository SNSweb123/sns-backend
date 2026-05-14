import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import productRoutes from '../routes/products.js';
import ordersRouter from '../routes/orders.js';
import paymentRoutes from "../routes/payment.js";


import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(cors());
app.use('/api/products', productRoutes);
app.use('/api/orders', ordersRouter);
app.use("/api/payment", paymentRoutes);


app.use(express.json());


// ✅ Root Route
app.get("/", (req, res) => {
  res.send("Backend Running 🚀");
});


// ✅ Mongo Connect
try {

  await mongoose.connect(process.env.MONGODB_URI);

  console.log("✅ MongoDB Connected");

} catch (err) {

  console.error("❌ MongoDB Error:");
  console.error(err);
}


// ✅ TEMP TEST ROUTE
app.get("/test", (req, res) => {
  res.json({
    success: true
  });
});


export default app;