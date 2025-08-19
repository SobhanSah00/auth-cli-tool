import { verifiToken } from "../utils/jwt.util.js";
export const authMiddleware = (req, res, next) => {
    let token = req.cookies['jwt'];
    console.log("token : ", token);
    if (!token) {
        res.status(401).json({
            message: "User is not authorized ."
        });
        return;
    }
    try {
        const verifiedUser = verifiToken(token);
        console.log("verifieUser : ", verifiedUser);
        if (!verifiedUser?.id) {
            res.status(401).json({
                message: "Invalid Token"
            });
            return;
        }
        req.userId = verifiedUser.id;
        next();
    }
    catch {
        res.status(401).json({ error: "Invalid token" });
    }
};
