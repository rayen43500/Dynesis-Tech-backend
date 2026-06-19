import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadsRoot = path.join(__dirname, '../../uploads');
export const developersUploadDir = path.join(uploadsRoot, 'developers');
export const usersUploadDir = path.join(uploadsRoot, 'users');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

ensureDir(developersUploadDir);
ensureDir(usersUploadDir);

function createImageUploadStorage(destinationDir) {
  return multer.diskStorage({
    destination(_req, _file, cb) {
      ensureDir(destinationDir);
      cb(null, destinationDir);
    },
    filename(_req, file, cb) {
      const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
      cb(null, `${Date.now()}-${safeName}`);
    }
  });
}

const developerStorage = createImageUploadStorage(developersUploadDir);
const userStorage = createImageUploadStorage(usersUploadDir);

function fileFilter(_req, file, cb) {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
    return;
  }
  cb(new Error('Only jpg, jpeg, png, and webp images are allowed'));
}

export const developerPhotoUpload = multer({
  storage: developerStorage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

export const developerPortfolioUpload = multer({
  storage: developerStorage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 6 }
});

export const userPhotoUpload = multer({
  storage: userStorage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

export function toPublicUploadPath(filename) {
  return `/uploads/developers/${filename}`;
}

export function toPublicUserUploadPath(filename) {
  return `/uploads/users/${filename}`;
}

export function deleteUploadFile(publicPath) {
  if (!publicPath || typeof publicPath !== 'string') return;
  if (publicPath.startsWith('/uploads/developers/')) {
    const filename = path.basename(publicPath);
    const fullPath = path.join(developersUploadDir, filename);
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    return;
  }
  if (publicPath.startsWith('/uploads/users/')) {
    const filename = path.basename(publicPath);
    const fullPath = path.join(usersUploadDir, filename);
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
  }
}

export function deleteUploadFiles(paths = []) {
  for (const p of paths) {
    deleteUploadFile(p);
  }
}
