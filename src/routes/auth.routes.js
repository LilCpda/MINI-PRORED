import {Router} from "express";
import { register, login, me } from "../controllers/auth.controller.js";
import {verifyToken } from "../middlewares/auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", verifyToken, me);

export default router;