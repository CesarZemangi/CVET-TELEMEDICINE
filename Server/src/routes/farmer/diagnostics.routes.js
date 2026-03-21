import express from "express"
import auth from "../../middleware/auth.middleware.js"
import { predictDisease } from "../../controllers/ml.controller.js"
import multer from "multer"
import path from "path"
import fs from "fs"
import {
  getLabRequests,
  createLabRequest,
  getLabResults,
  farmerUploadLabResult,
  deleteLabResult,
  getVaccinations,
  getScreenings
} from "../../controllers/farmer/diagnostics.controller.js"

const router = express.Router()

const labResultsDir = path.join(process.cwd(), "uploads", "lab-results")
if (!fs.existsSync(labResultsDir)) {
  fs.mkdirSync(labResultsDir, { recursive: true })
}
const labResultUpload = multer({
  storage: multer.diskStorage({
    destination: labResultsDir,
    filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
  }),
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "application/pdf") return cb(null, true)
    return cb(new Error("Only PDF lab results are allowed"))
  },
  limits: { fileSize: 50 * 1024 * 1024 } // allow up to ~50MB
})

router.get("/lab-requests", auth, getLabRequests)
router.post("/lab-requests", auth, createLabRequest)
router.get("/lab-results", auth, getLabResults)
router.post(
  "/lab-results",
  auth,
  labResultUpload.fields([
    { name: "file", maxCount: 1 },
    { name: "resultFile", maxCount: 1 },
    { name: "lab_file", maxCount: 1 }
  ]),
  farmerUploadLabResult
)
router.delete("/lab-results/:id", auth, deleteLabResult)
router.get("/vaccinations", auth, getVaccinations)
router.get("/screenings", auth, getScreenings)
router.post("/predict", auth, predictDisease)

export default router
