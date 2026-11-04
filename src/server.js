import http from "http";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { initSocket } from "./socket.js";

const PORT = process.env.PORT || 3000;

await connectDB();

const server = http.createServer(app); // Express pasa a ser un handler del servidor HTTP
initSocket(server);

server.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});