import express from "express";
import { adminProtect, userProtect } from "../middleware/userAuth.js";

import {
  placeOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
} from "../controllers/orders.controller.js";

const router = express.Router();

// User
router.post("/place-order", userProtect, placeOrder);
router.get("/my-orders", userProtect, getMyOrders);

// Admin
router.get("/get-all-orders", userProtect, adminProtect, getAllOrders);

// User
router.get("/:id", userProtect, getOrderById);
router.patch("/cancel-order/:id", userProtect, cancelOrder);
export default router;
