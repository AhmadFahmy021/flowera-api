import { Module } from '@nestjs/common';
import { RepositoryHelper } from './helpers/repository.helper';
import { MinioService } from './services/minio.service';
import { NotificationService } from './services/notification.service';

@Module({
  providers: [RepositoryHelper, MinioService, NotificationService],
  exports: [RepositoryHelper, MinioService, NotificationService],
})
export class CommonModule {}