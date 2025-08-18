import { verifiToken } from "../utils/jwt.util";
export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        res.status(401).json({
            message: "User is not authorized ."
        });
        return;
    }
    try {
        const verifiedUser = verifiToken(token);
        if (!verifiedUser?._id) {
            res.status(401).json({
                message: "Invalid Token"
            });
            return;
        }
        req.userId = verifiedUser._id;
        next();
    }
    catch {
        res.status(401).json({ error: "Invalid token" });
    }
};
