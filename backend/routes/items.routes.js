import express from "express";
import Item from "../models/items.model.js";
import { adminProtect, userProtect } from "../middleware/userAuth.js";
import {
  createItem,
  deleteItem,
  editItem,
  getAllItems,
  getSingleItem,
} from "../controllers/items.controller.js";

const router = express.Router();

//admin
router.post("/add-item", userProtect, adminProtect, createItem);
router.patch("/edit-item/:id", userProtect, adminProtect, editItem);
router.delete("/delete-item/:id", userProtect, adminProtect, deleteItem);

router.get("/get-Allitems", userProtect, getAllItems);
router.get("/get-item/:id", userProtect, getSingleItem);

export default router;
