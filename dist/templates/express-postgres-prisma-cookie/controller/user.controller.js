import { prisma } from "../db/Database.js";
import { hashPassword, comparePassword } from "../utils/hash.util.js";
import { generateJwtToken } from "../utils/jwt.util.js";
export async function signup(req, res) {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({
            message: "please fill the all the field"
        });
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
        });
    }
    try {
        const hassedPassword = await hashPassword(password);
        const createdUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hassedPassword
            }
        });
        if (!createdUser) {
            return res.status(500).json({
                message: "someting went wrong while creating user"
            });
        }
        const user = {
            id: createdUser.id,
            username: createdUser.username,
            email: createdUser.email
        };
        const token = generateJwtToken(user);
        const options = {
            httpOnly: true,
            // secure : true, // run on only in production,
            maxAge: 30 * 24 * 60 * 60 * 1000
        };
        res.cookie('cookie', token, options);
        res.status(201).json({
            message: "User signed up successfully.",
            user,
            token,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
}
export async function signin(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            message: "please give all the field"
        });
    }
    const userFound = await prisma.user.findFirst({
        where: {
            email
        }
    });
    if (!userFound) {
        return res.status(404).json({
            message: "The userNAME is does not exist"
        });
    }
    const validatedPassword = comparePassword(password, userFound.password);
    if (!validatedPassword) {
        res.status(404).json({
            message: "The password is incorrect",
        });
        return;
    }
    const user = {
        id: userFound.id,
        username: userFound.username,
        email: userFound.email
    };
    const token = generateJwtToken(user);
    const options = {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000
    };
    res.cookie('cookie', token, options);
    res.status(201).json({
        message: "User signed in successfully.",
        user,
        token,
    });
}
export async function signout(req, res) {
    res.clearCookie("cookie");
    res.json({
        message: "User log out ."
    });
}
export async function getCurrentUser(req, res) {
    const userId = req.userId;
    try {
        const FoundedUser = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        const user = {
            id: FoundedUser?.id,
            username: FoundedUser?.username,
            email: FoundedUser?.email,
        };
        res.status(200).json({
            message: "User Information",
            user
        });
    }
    catch (error) {
        res.status(401).json({
            message: "Error faced while getting user info, try again"
        });
    }
}
