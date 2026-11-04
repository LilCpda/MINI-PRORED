import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Sube un buffer (archivo en memoria) a Cloudinary y devuelve el resultado
export const uploadBuffer = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "mini-red-social" },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    stream.end(buffer);
  });

export default cloudinary;