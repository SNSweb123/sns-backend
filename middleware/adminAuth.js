const adminAuth = (req, res, next) => {

  const adminKey = req.headers["x-admin-key"];

  console.log("HEADER:", adminKey);
  console.log("ENV:", process.env.ADMIN_SECRET);

  // TEMPORARY FORCE CHECK
  if (adminKey !== "snsadmin123") {

    return res.status(401).json({
      message: "Unauthorized"
    });

  }

  next();
};

export default adminAuth;