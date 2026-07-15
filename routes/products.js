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


    const updated = await SubscriptionProduct.findByIdAndUpdate(
    req.params.id,
    data,
    { new:true }
);

res.json(updated);



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



// DELETE SINGLE COUPON CODE
router.delete("/:productId/code/:codeId", adminAuth, async (req, res) => {
  try {

    const { productId, codeId } = req.params;

    await SubscriptionProduct.findByIdAndUpdate(
      productId,
      {
        $pull: {
          couponCodes: {
            _id: codeId
          }
        }
      }
    );

    res.json({
      success: true
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }
});




export default router;