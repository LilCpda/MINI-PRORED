import express from "express";
import postRoutes from "./routes/post.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

//Middleware 1: Body JSON en  req.body
app.use(express.json());


//Middleware 2: uno propio, un logger
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`)
    next();
});

//Rutas
app.get("/api/ping", (req, res) =>{
    res.json({ message: "pong"});
});

//Parametros de ruta 
app.get("/api/saludo/:nombre", (req,res) => {
    res.json({message: `Hola ${req.params.nombre}`});
});

//Query string
app.get("/api/buscar", (req, res) => {
    res.json({ buscaste: req.query.q});
});

//Body: Post con JSON
app.post("/api/echo", (req, res) => {
    res.status(201).json({ recibido: req.body });
});

//Ruta que falla a proposito
app.get("/api/error", async (req, res) => {
    throw new Error("Algo salió mal");
});

//ruta Reales
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

//404
app.use((req, res) => {
    res.status(404).json({ error: "Ruta no encontrada" });
});

//Manejo de errores
app.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }
  if (err.name === "CastError") {
    return res.status(400).json({ error: "ID inválido" });
  }
  if (err.code === 11000) {
    return res.status(409).json({ error: "Ya existe un registro con esos datos" });
  }
  console.error(err);
  res.status(err.status || 500).json({ error: err.message });
});

export default app;