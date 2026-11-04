import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
    content: { type: String, required: true, maxlength: 500 },
    image: { type: String, default: null }, // acá irá la URL de Cloudinary
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
);

export default mongoose.model("Post", postSchema);