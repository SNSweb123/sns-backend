import express from "express";
import Newsletter from "../models/Newsletter.js";

const router = express.Router();

// Subscribe API
router.post("/subscribe", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // validation
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // duplicate check
    const exists = await Newsletter.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already subscribed" });
    }

    const saved = await Newsletter.create({ email });

    res.status(201).json({
      message: "Subscribed successfully",
      data: saved,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;