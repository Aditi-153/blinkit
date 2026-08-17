import express from "express";
import User from "../models/userModel";
import { userLogin, userLogout, userRegister } from "../controllers/user.controller";
import { userProtect } from "../middleware/userAuth";

const router = express.Router();

router.post("/login",userProtect ,userLogin );
router.post("/register", userRegister );
router.post("/logout",userProtect, userLogout);

export default router;

