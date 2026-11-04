import {router} from "express";
import { createPost, getPosts, getPostById, updatePost, deletePost } from "../controllers/post.controller.js";
import { verifyToken } from "../middlewares/auth.js";
import { upload } from "../middlewares/upload.js";

const router = Router();

// Públicas (no requieren login)
router.get("/", getPosts);
router.get("/:id", getPostById);

// Protegidas (requieren token)
router.post("/", verifyToken, createPost);        // requieren login
router.patch("/:id", verifyToken, updatePost);
router.delete("/:id", verifyToken, deletePost);

export default router;