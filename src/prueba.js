import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";
import Post from "./models/Post.js";

await connectDB();

// Limpiamos para poder correr el script varias veces (solo para esta prueba)
await User.deleteMany();
await Post.deleteMany();

const user = await User.create({
    username: "ana",
    email: "NERI@mail.com",
    password: "12345",
});

await Post.create({ content: "Mi primer post", author: user._id });

console.log("SIN populante:", await Post.find());

const posts = await Post.find().populate("author", "username email");
console.log("CON populate:", JSON.stringify(Post, null, 2));

await mongoose.disconnect();