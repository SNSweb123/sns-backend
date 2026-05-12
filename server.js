import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import ordersRouter from './routes/orders.js';
import productRoutes from './routes/products.js';
import Product from './models/Product.js';
import uploadRoutes from "./routes/upload.js";
import newsletterRoutes from "./routes/newsletterRoutes.js";
import paymentRoutes from "./routes/payment.js";
import adminRoutes from "./routes/admin.js";




import dotenv from "dotenv";
dotenv.config();


const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log('MongoDB Connection Error:', err));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', ordersRouter);
app.use("/api/upload", uploadRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);

// Admin route to get all products
app.get('/api/admin/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
