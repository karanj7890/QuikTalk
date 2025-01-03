import express from "express"
import { protectRoute } from "../middleware/authMiddleware.js"
import { deleteMessage, getMessages, getUsersForSidebar, sendMessage } from "../controllers/messageController.js"
import upload from "../middleware/multer.js"

const router= express.Router()

router.get("/users",protectRoute,getUsersForSidebar)

router.get("/:id", protectRoute, getMessages)

router.post("/send/:id",protectRoute,upload.single('image'),sendMessage)

// delete chats
router.delete("/delete/:id", protectRoute, deleteMessage)

export default router;