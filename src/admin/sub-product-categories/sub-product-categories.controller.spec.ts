import { Test, TestingModule } from '@nestjs/testing';
import { SubProductCategoriesController } from './sub-product-categories.controller';
import { SubProductCategoriesService } from './sub-product-categories.service';

describe('SubProductCategoriesController', () => {
  let controller: SubProductCategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubProductCategoriesController],
      providers: [SubProductCategoriesService],
    }).compile();

    controller = module.get<SubProductCategoriesController>(SubProductCategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
