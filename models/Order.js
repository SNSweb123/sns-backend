import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  
  // ✅ YOUR CUSTOM ORDER ID
  orderId: {
    type: String,
    required: true
  },

  // ✅ RAZORPAY ORDER ID
  razorpayOrderId: {
    type: String
  },

  items: [
    {
      productId: String,
      productName: String,
      productType: String,
      quantity: Number,
      price: Number
    }
  ],

  totalPriceINR: Number,
  totalPriceUSDT: Number,

  fullName: String,
  email: String,
  phone: String,

  // ✅ PAYMENT ID
  transactionId: String,

  deliveredCodes: [
    {
      productName: String,
      code: String
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Order', orderSchema);