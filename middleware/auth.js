// middleware/auth.js
export const auth = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token || token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  next();
};