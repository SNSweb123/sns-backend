import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [
    {
      productId: String,
      name: String,
      type: String,
      quantity: Number,
      discountedPrice: Number,
    },
  ],
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Cart', cartSchema);