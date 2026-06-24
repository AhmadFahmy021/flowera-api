import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/database/entities/product.entity';
import { ProducCategories } from 'src/database/entities/prouct-categories.entity';
import { Store } from 'src/database/entities/store.entity';
import { Repository } from 'typeorm';

@Injectable()
export class HomeService {
    constructor(
        @InjectRepository(ProducCategories) private readonly productCategoriesRepository: Repository<ProducCategories>,
        @InjectRepository(Product) private readonly productRepository: Repository<Product>,
        @InjectRepository(Store) private readonly storeRepository: Repository<Store>,
    ){}

    async index(){
        try {
            const productCategories = await this.productCategoriesRepository.find({select: {
                title: true,
                id: true
            }});

            const product = await this.productRepository.find({
                relations: {
                    store: true
                }
            })

            const store = await this.storeRepository.find()
            
            return {
                productCategories: productCategories ?? [],
                product: product ?? [],
                store: store ?? []
            }
        } catch (error) {
            throw error;
        }
    }
}
