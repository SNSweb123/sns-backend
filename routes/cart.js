import express from 'express';
import Cart from '../models/Cart.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// GET cart for a user
router.get('/:userId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.json(cart ? cart.items : []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE cart for a user
router.post('/:userId', auth ,async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) {
      cart = new Cart({ userId: req.params.userId, items: req.body.items });
    } else {
      cart.items = req.body.items; // overwrite with current items
      cart.updatedAt = new Date();
    }
    await cart.save();
    res.json(cart.items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;