import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const httpError = (status, message) => {
  const err = new Error(message);
  err.status = status;
  return err;
}

const signToken = (user) => 
    jwt.sign({ id: user._id}, process.env.JWT_SECRET, { expiresIn: "7d" });

export const register = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        throw httpError(400, "username, email y password son requeridos");   
    }
    if(password.length < 6) {
        throw httpError(400, "La contraseña debe tener al menos 6 caracteres");
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hash });

    res.status(201).json({
        user: { id: user._id, username: user.username, email: user.email},
        token: signToken(user)
    });
};

export const login = async (req, res) => {
    const { email, password } = req.body;

      // password tiene select:false, así que hay que pedirla explícitamente
    const user = await User.findOne({ email }).select("+password");
    if (!user)
        throw httpError(401, "Credenciales inválidas");
    
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) 
        throw httpError(401, "Credenciales inválidas"); 

        res.json({
            user: { id: user._id, username: user.username, email: user.email},
            token: signToken(user)
        });
    };

    export const me = async (req, res) => {
        const user = await User.findById(req.user.id);
        res.json(user);
    };
    
