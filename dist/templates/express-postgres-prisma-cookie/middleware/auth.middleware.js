import { verifiToken } from "../utils/jwt.util.js";
export async function authenticatedUser(req, res, next) {
    let token = req.cookies['cookie'];
    if (!token) {
        res.status(401).json({
            message: "User is not authorized ."
        });
        return;
    }
    try {
        const verifiedUser = verifiToken(token);
        if (!verifiedUser?.id) {
            res.status(401).json({
                message: "Invalid Token"
            });
            return;
        }
        req.userId = verifiedUser.id;
        next();
    }
    catch (error) {
        res.status(401).json({
            message: "Token verification failed"
        });
    }
}
