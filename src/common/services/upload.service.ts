import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadService {
  generatePath(
    folder: string,
    filename: string,
  ) {
    return `/uploads/${folder}/${filename}`;
  }
}