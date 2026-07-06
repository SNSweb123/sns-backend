import express from "express";

import SubscriptionProduct from "../models/SubscriptionProduct.js";

import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();


// =============================
// GET ALL PRODUCTS
// =============================
router.get("/", async (req, res) => {
  try {

    const products = await SubscriptionProduct.find();

    res.json(products);

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

    const deleted =
      await SubscriptionProduct.findByIdAndDelete(req.params.id);

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


// =============================
// UPDATE
// =============================
router.put("/:id", adminAuth, async (req, res) => {

  try {

    const data = req.body;

    let updated = null;

    // SUBSCRIPTION
    if (data.type === "subscription") {

      updated =
        await SubscriptionProduct.findByIdAndUpdate(
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