const jwt = require("jsonwebtoken");

const jwtAuthMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized access" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // ✅ Ye tab hi chalega jab token mein user wrapped ho
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

const generateToken = (user) => {
  return jwt.sign(user , process.env.JWT_SECRET, {
    expiresIn: "1h"
  });
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: 'Forbidden: Admins only' });
  }
};

module.exports = {
  jwtAuthMiddleware,
  generateToken,
  isAdmin,
  
};
