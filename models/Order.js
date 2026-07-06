import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({


 status: {
  type: String,
  enum: ["pending", "approved", "rejected"],
  default: "pending"
},
  
  // ✅ YOUR CUSTOM ORDER ID
  orderId: {
    type: String,
    required: true
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