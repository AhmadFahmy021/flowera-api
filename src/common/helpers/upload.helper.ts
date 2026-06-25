import { diskStorage, memoryStorage } from 'multer';
import * as path from 'path';
import { promises as fs } from 'fs';

export class UploadHelper {
  // static storage(folder: string) {
    
  //   return diskStorage({
  //     destination: `./src/uploads/${folder}`,

  //     filename: (req, file, callback) => {
  //       const ext = path.extname(
  //         file.originalname,
  //       );

  //       const fileName =
  //         `${Date.now()}${ext}`;

  //       callback(null, fileName);
  //     },
  //   });
  // }
  static storage() {
    return memoryStorage();
  }
  static async deleteFile(
    filePath: string,
    ): Promise<void> {
    try {
        const fullPath = path.resolve(
        process.cwd(),
        'src',
        filePath.replace(/^\/uploads\//, 'uploads/'),
        );

        console.log('Delete File:', fullPath);

        await fs.unlink(fullPath);
    } catch (error) {
        console.error(
        'Delete file error:',
        error,
        );
    }
    }
}