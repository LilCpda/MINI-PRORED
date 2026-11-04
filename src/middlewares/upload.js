import multer from "multer";

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    const err = new Error("Solo se permiten imágenes");
    err.status = 400;
    cb(err);
  }
};

export const upload = multer({
  storage: multer.memoryStorage(), // el archivo queda en req.file.buffer
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // máximo 5 MB
});