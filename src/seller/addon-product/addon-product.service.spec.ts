import { Test, TestingModule } from '@nestjs/testing';
import { AddonProductService } from './addon-product.service';

describe('AddonProductService', () => {
  let service: AddonProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AddonProductService],
    }).compile();

    service = module.get<AddonProductService>(AddonProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
