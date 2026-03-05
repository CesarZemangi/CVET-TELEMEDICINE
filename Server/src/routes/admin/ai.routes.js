import express from "express";
import fs from "fs";
import path from "path";
import multer from "multer";
import {
  getAiUsageSummary,
  getPredictionLogs,
  getAiOpsLogs,
  getTrainingDatasetRecords,
  getDataQualitySummary,
  exportCasesCsv,
  uploadModelFile
} from "../../controllers/admin/ai.controller.js";

const router = express.Router();

const modelDir = path.join(process.cwd(), "storage", "models");
if (!fs.existsSync(modelDir)) {
  fs.mkdirSync(modelDir, { recursive: true });
}

const upload = multer({ dest: modelDir });

router.get("/summary", getAiUsageSummary);
router.get("/prediction-logs", getPredictionLogs);
router.get("/ops-logs", getAiOpsLogs);
router.get("/dataset-records", getTrainingDatasetRecords);
router.get("/data-quality", getDataQualitySummary);
router.get("/export-cases-csv", exportCasesCsv);
router.post("/model/upload", upload.single("model"), uploadModelFile);

export default router;
