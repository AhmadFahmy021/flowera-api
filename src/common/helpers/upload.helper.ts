// src/common/helpers/upload.helper.ts

import { diskStorage } from 'multer';
import * as path from 'path';

export class UploadHelper {
  static storage(folder: string) {
    return diskStorage({
      destination: `./uploads/${folder}`,

      filename: (req, file, callback) => {
        const ext = path.extname(
          file.originalname,
        );

        const fileName =
          `${Date.now()}${ext}`;

        callback(null, fileName);
      },
    });
  }
}