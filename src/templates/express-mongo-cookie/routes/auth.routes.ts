import { Router } from "express";
import { signup, login } from "../controller/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.route("/signup").post(signup)
router.route("/signin").post(login)
router.route("/me").get(authMiddleware)


export default router;
