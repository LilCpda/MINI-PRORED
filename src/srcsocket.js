import {Server} from "socket.io";
import jwt from "jsonwebtoken";
let io;

export function initSocket(httpServer) {
    io = new Server(httpServer, {
        cors: {
            origin: "*",
        },
    });

    io.use ((socket, next) => {
        const token = socket.handshake.auth?.token;
        if (!token)
            return next(new Error("Authentication error"));
            
            try{
                const payload = jwt.verify(token, process.env.JWT_SECRET);
                socket.userId = payload.Id;
                next();
            } catch {
                next(new Error("Authentication error"));
            }
        });
        
    io.on("connection", (socket) => {
        console.log("Cliente no encontrado:", socket.id, "usuario:", socket.userId);

        socket.join(`user:${socket.userId}`);

        socket.on("disconnect", () => {
            console.log("Cliente desconectado:", socket.id);
        });
    });

    return io;
}

export function getIO() {
    if (!io) throw new Error("Socket.io no ha sido inicializado");
        return io;
}