import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export async function protect(req, res, next) {
    try {
        let token = req.cookies?.token;

        if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                message: "Not authenticated",
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                message: "User no longer exists",
            });
        }

        req.user = user;
        next(); 
    } catch (error) {
        return res.status(401).json({
            message: "Session expired or invalid",
        });
    }
}