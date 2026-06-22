import { Module } from '@nestjs/common';
import { RepositoryHelper } from './helpers/repository.helper';

@Module({
  providers: [RepositoryHelper],
  exports: [RepositoryHelper],
})
export class CommonModule {}