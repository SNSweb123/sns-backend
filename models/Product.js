import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    subtitle: String,

    type: {
      type: String,
      enum: ['subscription', 'gift-voucher'],
      required: true
    },

    validity: String,

    delivery: String,

    originalPrice: {
      type: Number,
      required: true
    },

    discountedPrice: {
      type: Number,
      required: true
    },

    discountPercent: Number,

    icon: String,

    gradient: String,

    iconUrl: String,

    resourceType: {
      type: String,
      enum: ['code', 'link'],
      default: 'code'
    },

    couponCodes: [
      {
        value: {
          type: String,
          required: true
        },

        isUsed: {
          type: Boolean,
          default: false
        }
      }
    ],

    isActive: {
      type: Boolean,
      default: true
    }
  },

  { timestamps: true }
);

export default mongoose.model('Product', productSchema);