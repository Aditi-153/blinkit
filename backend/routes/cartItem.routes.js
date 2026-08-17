import express from "express";
import { userProtect } from "../middleware/userAuth";
import {
  addItem,
  deleteItem,
  getCartItem,
  updateQuantity,
} from "../controllers/cartItem.controller";

const router = express.Router();

router.post("/add-item/:id", userProtect, addItem);
router.get("/get-cart-item", userProtect, getCartItem);
router.patch("/update-quantity/:id", userProtect, updateQuantity);
router.delete("/delete-item/:id", userProtect, deleteItem);

export default router;
