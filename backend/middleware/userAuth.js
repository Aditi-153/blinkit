import jwt from "jsonwebtoken";
import User from "../models/userModel";

export const userProtect = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "please login first",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(400).json({
        message: "user not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "failed to authorized",
    });
  }
};

export const adminProtect = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Please login first",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Access denied. Admin only",
    });
  }

  next();
};
