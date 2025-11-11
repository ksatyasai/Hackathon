import { Router } from 'express';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import { authGuard } from '../middleware/authGuard.js';
import { createDoc, downloadDoc, getDoc, listDocs } from '../controllers/documents.controller.js';

// ensure uploads dir exists
const uploadDir = path.resolve('uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const safe = Date.now() + '-' + file.originalname.replace(/[^\w.\-]+/g, '_');
    cb(null, safe);
  }
});
const upload = multer({ storage });

const router = Router();

router.get('/', authGuard(true), listDocs);
router.get('/:id', authGuard(true), getDoc);
router.get('/:id/download', authGuard(true), downloadDoc);
router.post('/', authGuard(true), upload.single('file'), createDoc);

export default router;
