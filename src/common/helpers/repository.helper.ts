import { Injectable } from '@nestjs/common';
import {
  DeepPartial,
  ObjectLiteral,
  Repository,
} from 'typeorm';

@Injectable()
export class RepositoryHelper {
  async createAndSave<T extends ObjectLiteral>(
    repository: Repository<T>,
    data: DeepPartial<T>,
  ): Promise<T> {
    const entity = repository.create(data);

    return await repository.save(entity);
  }
}