import {
  applyDecorators,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadHelper } from '../helpers/upload.helper';

export function UploadFile(
  folder?: string,
  field = 'file',
) {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor(field, {
        storage: UploadHelper.storage(),
      }),
    ),
  );
}