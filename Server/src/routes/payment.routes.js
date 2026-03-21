import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import {
  initiatePayment,
  verifyPayment,
  rejectPayment,
  getPaymentStatus,
  getMyPayments,
  getAdminPayments,
  getVetPayments,
  downloadPaymentReceipt
} from "../controllers/payment.controller.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const dir = path.join(process.cwd(), "storage/uploads/payments");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename(req, file, cb) {
    cb(null, `${uuidv4()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }
});

router.post("/initiate", authenticate, upload.single("proof_file"), initiatePayment);
router.get("/receipt/:id", authenticate, downloadPaymentReceipt);
router.get("/status/:appointment_id", authenticate, getPaymentStatus);
router.get("/mine", authenticate, authorizeRoles("farmer"), getMyPayments);
router.get("/admin", authenticate, authorizeRoles("admin"), getAdminPayments);
router.post("/admin/:id/verify", authenticate, authorizeRoles("admin"), verifyPayment);
router.post("/admin/:id/reject", authenticate, authorizeRoles("admin"), rejectPayment);
router.get("/vet", authenticate, authorizeRoles("vet"), getVetPayments);

export default router;
