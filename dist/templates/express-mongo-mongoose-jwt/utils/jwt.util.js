import jwt from "jsonwebtoken";
const JWT_TOKEN = process.env.JWT_SECRET || "auth-Cli-Tool";
export const generateJwtToken = (user) => {
    const token = jwt.sign(user, JWT_TOKEN);
    return token;
};
export const verifiToken = (token) => {
    return jwt.verify(token, JWT_TOKEN);
};
