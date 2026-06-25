import { Module } from '@nestjs/common';
import { RepositoryHelper } from './helpers/repository.helper';
import { MinioService } from './services/minio.service';

@Module({
  providers: [RepositoryHelper, MinioService],
  exports: [RepositoryHelper, MinioService],
})
export class CommonModule {}