import { prisma } from "../db/Database.js"
import { Request, Response } from "express"
import { hashPassword, comparePassword } from "../utils/hash.util.js"
import jwt from "jsonwebtoken"

export async function signup(req: Request, res: Response) {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            message: "please fill the all the field"
        })
    }

    const isUserExist = await prisma.user.findFirst({
        where: {
            OR: [
                { username: username },
                { email: email }
            ]
        }
    });

    if (isUserExist) {
        return res.status(400).json({
            message: "User is already exist."
        })
    }

    try {
        const hassedPassword = await hashPassword(password);

        const createdUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hassedPassword
            }
        })

        if (!createdUser) {
            return res.status(500).json({
                message: "someting went wrong while creating user"
            })
        }

        res.status(201).json({
            message: "User signed up successfully.",
            createdUser,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error",
        });
    }

}

export async function signin(req: Request, res: Response) {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({
            message: "please give all the field"
        })
    }

    const userFound = await prisma.user.findFirst({
        where: {
            email
        }
    })

    if (!userFound) {
        return res.status(404).json({
            message: "The userNAME is does not exist"
        })
    }

    const validatedPassword = comparePassword(password, userFound.password)

    if (!validatedPassword) {
        res.status(404).json({
            message: "The password is incorrect",
        });
        return;
    }

    const token = jwt.sign({ id: userFound.id }, process.env.JWT_SECRET as string, {
        expiresIn: "1h",
    });

    res.status(201).json({
        message: "User signed in successfully.",
        token,
    });
}

export async function signout(req: Request, res: Response) {
    // On Bearer JWT, server can't kill token, just tell client to discard it
    res.json({
        message: "Logged out successfully. Please discard your token."
    })
}

export async function getCurrentUser(req: Request, res: Response) {
    const userId = req.userId

    try {
        const FoundedUser = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        const user = {
            id: FoundedUser?.id,
            username: FoundedUser?.username,
            email: FoundedUser?.email,
        }

        res.status(200).json({
            message: "User Information",
            user
        })
    } catch (error) {
        res.status(401).json({
            message: "Error faced while getting user info, try again"
        })
    }
}