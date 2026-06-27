import { Test, TestingModule } from '@nestjs/testing';
import { SubProductCategoriesService } from './sub-product-categories.service';

describe('SubProductCategoriesService', () => {
  let service: SubProductCategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubProductCategoriesService],
    }).compile();

    service = module.get<SubProductCategoriesService>(SubProductCategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
