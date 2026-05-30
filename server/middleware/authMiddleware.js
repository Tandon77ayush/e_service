import jwt from "jsonwebtoken";
import User from "../models/User.js";


export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = user;
      next();
      return;
    }

    return res.status(401).json({
      message: "Not authorized, no token",
    });
  } catch (error) {
    return res.status(401).json({
      message: error.message,
    });
  }
};


export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({
      message: "Admin access only",
    });
  }
};


export const providerOnly = (req, res, next) => {
  try {
    if (req.user && req.user.role === "provider") {
      return next();
    }

    return res.status(403).json({
      message: "Provider access only",
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};