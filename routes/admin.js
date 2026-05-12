import express from "express";

const router = express.Router();

router.post("/login", (req, res) => {

  const { password } = req.body;

  // ENV se password lo
  if (password === process.env.ADMIN_PASSWORD) {

    return res.json({
      success: true
    });
  }

  res.status(401).json({
    success: false,
    message: "Invalid password"
  });
});

export default router;