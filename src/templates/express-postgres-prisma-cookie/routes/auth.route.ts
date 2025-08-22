import express from "express"
import {signup,signin,signout,getCurrentUser} from "../controller/user.controller.js"
import {authenticatedUser} from "../middleware/auth.middleware.js"

const router = express()

router.route("/signup").post(signup)
router.route("/signin").post(signin)
router.route("/signout").get(signout)
router.route("/me").get(authenticatedUser,getCurrentUser)

export default router