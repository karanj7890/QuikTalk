import express from "express"
import { checkAuth, login, logout, signup, updateProfile } from "../controllers/authControllers.js"
import { protectRoute } from "../middleware/authMiddleware.js"
import upload from "../middleware/multer.js"

const router= express.Router()

router.post("/signup", signup)

router.post("/login",login)

router.post("/logout",logout)

// first we will see if the user has been authenticated or not
router.put('/update-profile', protectRoute,upload.single('image'),updateProfile);

// this checkAuth is used if a user refreshes the window it will tell it they have been logged out or not
router.get("/check",protectRoute,checkAuth)
export default router