import jwt from "jsonwebtoken";
import { User } from "../model/user.model.js";
import { comparePassword, hashPassword } from "../utils/hash.util.js";
export const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(401).json({
                message: "please give give all field.",
            });
        }
        const existingUser = await User.findOne({
            $or: [
                { email },
                { username }
            ]
        });
        if (existingUser) {
            return res.status(400).json({
                message: "user is already exist."
            });
        }
        console.log("data : ", username, email, password);
        const hashedPassword = await hashPassword(password);
        console.log("hassed passwor : ", hashPassword);
        const user = await User.create({ username, email, password: hashedPassword });
        res.status(201).json({
            message: "User is created",
            user
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user)
            return res.status(400).json({ error: "Invalid credentials" });
        const isMatch = comparePassword(password, user.password);
        if (!isMatch)
            return res.status(400).json({ error: "Invalid credentials" });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        res.json({ token });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const logout = (req, res) => {
    // On Bearer JWT, server can't kill token, just tell client to discard it
    return res.json({ message: "Logged out successfully. Please discard your token." });
};
export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(400).json({
                message: "User is not authorized",
            });
        }
        const currentUser = await User.findById(userId);
        if (!currentUser) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        const getUserInfo = {
            id: currentUser._id,
            username: currentUser.username, // check if your schema uses "username"
            email: currentUser.email,
        };
        return res.json(getUserInfo);
    }
    catch (err) {
        return res.status(500).json({
            message: "Internal server error",
            error: err.message,
        });
    }
};
