import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/UserSchema";


const JWT_SECRET = process.env.JWT_SECRET as string;

interface AuthRequest extends Request {
    user?: any;
}

// Protect Routes Middleware
export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded: any = jwt.verify(token,JWT_SECRET);
            req.user = await User.findById(decoded.userId).select("-password");
            next();
        } catch (error) {
            res.status(401).json({ message: "Not authorized, invalid token" });
        }
    }

    if (!token) {
        res.status(401).json({ message: "Not authorized, no token" });
    }
};
