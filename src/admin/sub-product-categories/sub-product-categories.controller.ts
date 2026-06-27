import { Controller } from '@nestjs/common';
import { SubProductCategoriesService } from './sub-product-categories.service';

@Controller('sub-product-categories')
export class SubProductCategoriesController {
  constructor(private readonly subProductCategoriesService: SubProductCategoriesService) {}
}
