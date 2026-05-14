const adminAuth = (req, res, next) => {

  const adminKey = req.headers["x-admin-key"];

  if (
    adminKey !== process.env.ADMIN_SECRET_KEY
  ) {
    return res.status(401).json({
      message: "Unauthorized"
    });
  }

  next();
};

export default adminAuth;