import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadsRoot = path.join(__dirname, '../../uploads');
export const developersUploadDir = path.join(uploadsRoot, 'developers');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

ensureDir(developersUploadDir);

const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    ensureDir(developersUploadDir);
    cb(null, developersUploadDir);
  },
  filename(_req, file, cb) {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${Date.now()}-${safeName}`);
  }
});

function fileFilter(_req, file, cb) {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
    return;
  }
  cb(new Error('Only jpg, jpeg, png, and webp images are allowed'));
}

export const developerPhotoUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

export const developerPortfolioUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 6 }
});

export function toPublicUploadPath(filename) {
  return `/uploads/developers/${filename}`;
}

export function deleteUploadFile(publicPath) {
  if (!publicPath || typeof publicPath !== 'string') return;
  if (!publicPath.startsWith('/uploads/developers/')) return;
  const filename = path.basename(publicPath);
  const fullPath = path.join(developersUploadDir, filename);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
}

export function deleteUploadFiles(paths = []) {
  for (const p of paths) {
    deleteUploadFile(p);
  }
}
