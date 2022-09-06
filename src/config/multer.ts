import * as path from 'path';
import * as multer from 'multer';
import * as md5 from 'md5';
import { Request } from 'express';

const store = multer.diskStorage({
  destination: (_req: Request, _file, cb) => {
    cb(null, './src/public/uploads/');
  },
  filename: (_req: Request, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, md5(file.originalname + Date()) + ext);
  },
});

export const multerConfig = {
  storage: store,
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext == '.jpg' || ext == '.png' || ext === '.svg' || ext === '.jpeg')
      cb(null, true);
    else cb(new Error('Only png svg jpg jpeg is accepted'));
  },
};
