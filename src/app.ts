import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "8mb" }));
app.use(express.urlencoded({ extended: true, limit: "16mb" }));
app.use(express.static("public"));
app.use(cookieParser());

import authMongoJwtRouter from "./templates/express-mongo-jwt/routes/auth.routes.js"
import authMongoCookieRouter from "./templates/express-mongo-cookie/routes/auth.routes.js"

app.use("/auth-mongo-jwt",authMongoJwtRouter)
app.use("/auth-mongo-cookie",authMongoCookieRouter)

export { app };