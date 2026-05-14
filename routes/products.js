import express from "express";

import SubscriptionProduct from "../models/SubscriptionProduct.js";
import GiftVoucherProduct from "../models/GiftVoucherProduct.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();


// =============================
// GET ALL PRODUCTS
// =============================
router.get("/", async (req, res) => {
  try {

    const subscriptions = await SubscriptionProduct.find();

    const giftVouchers = await GiftVoucherProduct.find();

    // dono merge
 const allProducts = [
  ...subscriptions.map(p => p.toJSON()),
  ...giftVouchers.map(p => p.toJSON())
];

    res.json(allProducts);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});


// =============================
// CREATE PRODUCT
// =============================
router.post("/", adminAuth, async (req, res) => {

  try {

    const data = req.body;

    // =========================
    // SUBSCRIPTION
    // =========================
    if (data.type === "subscription") {

      const product = new SubscriptionProduct(data);

      await product.save();

      return res.status(201).json(product);
    }

    // =========================
    // GIFT VOUCHER
    // =========================
    if (data.type === "gift-voucher") {

     const formattedCodes =
  (data.couponCodes || []).map(c => ({
    code: typeof c === "string" ? c : c.code,
    isUsed: false
  }));
      const product = new GiftVoucherProduct({
        ...data,
        couponCodes: formattedCodes
      });

      await product.save();

      return res.status(201).json(product);
    }

    res.status(400).json({
      error: "Invalid product type"
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });
  }
});


// =============================
// DELETE
// =============================
router.delete("/:id", adminAuth, async (req, res) => {

  try {

    let deleted =
      await SubscriptionProduct.findByIdAndDelete(req.params.id);

    if (!deleted) {
      deleted =
        await GiftVoucherProduct.findByIdAndDelete(req.params.id);
    }

    if (!deleted) {
      return res.status(404).json({
        error: "Product not found"
      });
    }

    res.json({
      message: "Deleted"
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });
  }
});

router.put(
  "/:id/coupon/delete",
  adminAuth,
  async (req, res) => {
  try {
    const { code } = req.body;

    const product = await GiftVoucherProduct.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.couponCodes = product.couponCodes.filter(
      (c) => c.code !== code
    );

    await product.save();

    res.json({
      message: "Coupon deleted",
      product
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// =============================
// UPDATE
// =============================
router.put("/:id", adminAuth, async (req, res) => {

  try {

    const data = req.body;

    let updated = null;

    if (data.type === "subscription") {

      updated =
        await SubscriptionProduct.findByIdAndUpdate(
          req.params.id,
          data,
          { new: true }
        );
    }

    if (data.type === "gift-voucher") {

      updated =
        await GiftVoucherProduct.findByIdAndUpdate(
          req.params.id,
          data,
          { new: true }
        );
    }

    res.json(updated);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });
  }
});

export default router;