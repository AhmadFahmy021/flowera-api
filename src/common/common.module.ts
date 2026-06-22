import { Module } from '@nestjs/common';
import { RepositoryHelper } from './helpers/repository.helper';
import { UploadService } from './services/upload.service';

@Module({
  providers: [RepositoryHelper, UploadService],
  exports: [RepositoryHelper, UploadService],
})
export class CommonModule {}