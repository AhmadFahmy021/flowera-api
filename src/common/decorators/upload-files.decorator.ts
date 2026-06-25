import {
  applyDecorators,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadHelper } from '../helpers/upload.helper';

export function UploadFiles(
  folder?: string,
  field = 'files',
  maxCount = 10,
) {
  return applyDecorators(
    UseInterceptors(
      FilesInterceptor(
        field,
        maxCount,
        {
          storage: UploadHelper.storage(),
        },
      ),
    ),
  );
}