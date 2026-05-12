import mongoose from 'mongoose';

const codeSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  code: { type: String, required: true },
  isUsed: { type: Boolean, default: false },
  usedBy: { type: String, default: null },
  usedAt: { type: Date, default: null }
}, { timestamps: true });

export default mongoose.model('Code', codeSchema);