import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import auth from '../../middleware/auth.middleware.js';
import {
  uploadMedia,
  getMediaByCaseId,
  getAllVetMedia,
  deleteMedia,
  getCasesForMedia
} from '../../controllers/vet/media.controller.js';

import fs from 'fs';

const router = express.Router();

const uploadDir = path.join(process.cwd(), 'uploads');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'video/mp4',
      'video/quicktime',
      'audio/mpeg'
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  }
});

router.get('/cases', auth, getCasesForMedia);
router.post('/upload', auth, upload.single('file'), uploadMedia);
router.get('/case/:case_id', auth, getMediaByCaseId);
router.get('/', auth, getAllVetMedia);
router.delete('/:id', auth, deleteMedia);

export default router;
