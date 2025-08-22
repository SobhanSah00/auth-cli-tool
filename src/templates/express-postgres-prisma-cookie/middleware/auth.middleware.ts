import {NextFunction,Request,Response} from "express"
import {verifiToken} from "../utils/jwt.util.js"

declare global {
    namespace Express {
        interface Request {
            userId?: string
        }
    }
}


export async function authenticatedUser(req:Request,res:Response,next:NextFunction) {
    let token = req.cookies['cookie'];

    if(!token) {
        res.status(401).json({
            message : "User is not authorized ."
        })
        return;
    }

    try {
        const verifiedUser = verifiToken(token);

        if(!verifiedUser?.id) {
            res.status(401).json({
                message : "Invalid Token"
            })
            return;
        }

        req.userId = verifiedUser.id;
        next()
    } catch (error) {
        res.status(401).json({
            message : "Token verification failed"
        })
    }
}