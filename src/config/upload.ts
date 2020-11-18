import path from 'path';
import crypto from 'crypto';
import multer from 'multer';

const uploadDirectory = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  directory: uploadDirectory,
  storage: multer.diskStorage({
    destination: uploadDirectory,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('hex');
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
};
