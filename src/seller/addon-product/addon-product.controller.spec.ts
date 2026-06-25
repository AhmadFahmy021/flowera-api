import { Test, TestingModule } from '@nestjs/testing';
import { AddonProductController } from './addon-product.controller';
import { AddonProductService } from './addon-product.service';

describe('AddonProductController', () => {
  let controller: AddonProductController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddonProductController],
      providers: [AddonProductService],
    }).compile();

    controller = module.get<AddonProductController>(AddonProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
