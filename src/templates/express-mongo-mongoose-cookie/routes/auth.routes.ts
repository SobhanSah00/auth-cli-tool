import { Router } from "express";
import { signup, login,getCurrentUser,logout } from "../controller/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/signup").post(signup)
router.route("/signin").post(login)
router.route("/me").get(authMiddleware,getCurrentUser)
router.route("/logout").get(logout)


export default router;
