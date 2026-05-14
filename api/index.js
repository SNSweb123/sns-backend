import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(cors());
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