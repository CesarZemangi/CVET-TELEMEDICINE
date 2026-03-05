import express from "express"
import { getMe, updateMe, getVets, getVetReviews } from "../controllers/user.controller.js"
import { authenticate } from "../middleware/auth.middleware.js"
import multer from "multer"
import path from "path"
import fs from "fs"

const router = express.Router()

const profileUploadDir = path.join(process.cwd(), "dist", "uploads")
if (!fs.existsSync(profileUploadDir)) {
  fs.mkdirSync(profileUploadDir, { recursive: true })
}

const profileStorage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, profileUploadDir),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase()
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`)
  }
})

const profileUpload = multer({
  storage: profileStorage,
  fileFilter: (_, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith("image/")) {
      cb(null, true)
      return
    }
    cb(new Error("Only image uploads are allowed"), false)
  },
  limits: { fileSize: 5 * 1024 * 1024 }
})

router.get("/me", authenticate, getMe)
router.put("/profile", authenticate, profileUpload.single('profile_image'), updateMe)
router.get("/vets", authenticate, getVets)
router.get("/vets/:id/reviews", authenticate, getVetReviews)

export default router
