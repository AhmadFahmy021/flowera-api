import { Controller } from '@nestjs/common';
import { AddonProductService } from './addon-product.service';

@Controller('addon-product')
export class AddonProductController {
  constructor(private readonly addonProductService: AddonProductService) {}
}
