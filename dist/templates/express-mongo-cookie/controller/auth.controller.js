import jwt from "jsonwebtoken";
import { User } from "../model/user.model";
import { comparePassword, hashPassword } from "../utils/hash.util";
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
        const hashedPassword = hashPassword(password);
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
