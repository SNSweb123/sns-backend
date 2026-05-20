const adminAuth = (req, res, next) => {

  const adminKey = req.headers["x-admin-key"];

  if (
    String(adminKey).trim() !==
    String(process.env.ADMIN_SECRET).trim()
  ) {

    return res.status(401).json({
      message: "Unauthorized"
    });

  }

  next();
};

export default adminAuth;