import express from "express";
import { userProtect } from "../middleware/userAuth.js";
import {
  getAddresses,
  updateAddress,
  deleteAddress,
  newAddress,
} from "../controllers/address.controller.js";

const router = express.Router();

router.post("/add-address", userProtect, newAddress);
router.get("/get-addresses", userProtect, getAddresses);
router.patch("/update-address/:id", userProtect, updateAddress);
router.delete("/delete-address/:id", userProtect, deleteAddress);

export default router;
