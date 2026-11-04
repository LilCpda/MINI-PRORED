import { getIO } from "../socket.js";
import Post from "../models/Post.js";
import { uploadBuffer } from "../config/cloudinary.js";

// Helper para lanzar errores con status
const httpError = (status, message) => {
  const err = new Error(message);
  err.status = status;
  return err;
};

// CREATE: el autor sale del token, la imagen es opcional
export const createPost = async (req, res) => {
  let image = null;

  if (req.file) {
    const result = await uploadBuffer(req.file.buffer);
    image = result.secure_url; // la URL que guardamos en Mongo
  }

  const post = await Post.create({
    content: req.body.content,
    image,
    author: req.user.id,
  });

  await post.populate("author", "username"); // para que el evento traiga el nombre

  getIO().emit("post:nuevo", post); // avisa a TODOS los conectados

  res.status(201).json(post);
};

// READ (lista, con paginación)
export const getPosts = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const posts = await Post.find()
    .populate("author", "username")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Post.countDocuments();
  res.json({ page, limit, total, posts });
};

// READ (uno)
export const getPostById = async (req, res) => {
  const post = await Post.findById(req.params.id).populate("author", "username");
  if (!post) throw httpError(404, "Post no encontrado");
  res.json(post);
};

// UPDATE: solo el dueño
export const updatePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) throw httpError(404, "Post no encontrado");
  if (post.author.toString() !== req.user.id) {
    throw httpError(403, "No podés editar posts de otros");
  }

  post.content = req.body.content;
  await post.save(); // save() ejecuta las validaciones
  res.json(post);
};

// DELETE: solo el dueño
export const deletePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) throw httpError(404, "Post no encontrado");
  if (post.author.toString() !== req.user.id) {
    throw httpError(403, "No podés borrar posts de otros");
  }

  await post.deleteOne();
  res.json({ message: "Post eliminado" });
};