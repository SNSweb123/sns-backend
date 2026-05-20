import mongoose from "mongoose";

const giftVoucherSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    subtitle: String,

    type: {
      type: String,
      default: "gift-voucher"
    },

    // ✅ ADD THESE
    validity: String,
    delivery: String,

    originalPrice: Number,

    discountedPrice: Number,

    discountPercent: Number,

    icon: String,

    gradient: String,




    // ✅ unlimited coupon codes
    couponCodes: [
      {
        code: String,
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

giftVoucherSchema.virtual("couponStats").get(function () {
  const total = this.couponCodes?.length || 0;
  const used = this.couponCodes?.filter(c => c.isUsed).length || 0;

  return {
    total,
    used,
    available: total - used
  };
});

giftVoucherSchema.set("toJSON", { virtuals: true });
giftVoucherSchema.set("toObject", { virtuals: true });

export default mongoose.model(
  "GiftVoucherProduct",
  giftVoucherSchema
);