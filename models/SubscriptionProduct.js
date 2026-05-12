import mongoose from "mongoose";

const subscriptionProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    subtitle: String,

    type: {
      type: String,
      default: "subscription"
    },

    validity: String,
    delivery: String,

    originalPrice: Number,
    discountedPrice: Number,
    discountPercent: Number,

    icon: String,
    gradient: String,

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default mongoose.model(
  "SubscriptionProduct",
  subscriptionProductSchema
);