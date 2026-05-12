import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    subtitle: String,
  type: {
  type: String,
  enum: ['subscription'],
  required: true
},
    validity: String,
    delivery: String,
    originalPrice: { type: Number, required: true },
    discountedPrice: { type: Number, required: true },
    discountPercent: Number,
    icon: String,
    gradient: String,
    iconUrl: String,
    isActive: { type: Boolean, default: true }
    
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);
