import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddonProduct } from 'src/database/entities/addon-product.entity';
import { ProductImage } from 'src/database/entities/product-image.entity';
import { ProductVariant } from 'src/database/entities/product-variant.entity';
import { Product } from 'src/database/entities/product.entity';
import { ProducCategories } from 'src/database/entities/prouct-categories.entity';
import { Store } from 'src/database/entities/store.entity';
import { IsNull, Repository } from 'typeorm';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Store) private readonly storeRepository: Repository<Store>,
        @InjectRepository(Product) private readonly productRepository: Repository<Product>,
        @InjectRepository(ProductImage) private readonly productImagetRepository: Repository<ProductImage>,
        @InjectRepository(ProductVariant) private readonly productVariantRepository: Repository<ProductVariant>,
        @InjectRepository(AddonProduct) private readonly addonProductRepository: Repository<AddonProduct>,
        @InjectRepository(ProducCategories) private readonly productCategoriesRepository: Repository<ProducCategories>,
    ){}

    async detailProduct(product_id: number){
        try {
            const product = await this.productRepository.findOne({
                where: {
                    id: product_id,
                    product_image:{ 
                        addon_product: IsNull(),
                        product_variant: IsNull(),
                    },
                },
                relations: {
                    product_image: true
                }
            })

            if (!product) {
                throw new NotFoundException("Product is not found");
            }

            const productVariants = await this.productVariantRepository.find({
                where:{
                    product: {
                        id: product_id,
                        product_image: {
                            addon_product: IsNull()
                        }
                    }
                },
                relations:{
                    product_image: true
                },
                order: {id: "ASC"}
            })

            const addon_product = await this.addonProductRepository.find({
                where: {
                    product: {
                        id: product_id,
                        product_image: {
                            product_variant: IsNull()
                        }
                    }
                },
                relations: {
                    product_image: true
                },
                order: {id: "ASC"}
            })


            return{
                status: "success",
                data: {
                    product: product,
                    product_variant: productVariants,
                    addon_product: addon_product
                }
            }
        } catch (error) {
            throw error;
        }
    }

    async getDataProductByCategories(product_categories_id: number){
        try {
            
            const product_categories = await this.productCategoriesRepository.findOne({
                where: {
                    id: product_categories_id
                }
            })

            if (!product_categories) {
                throw new NotFoundException("Product categories is not found")
            }

            const product = await this.productRepository.find({
                where: {
                    sub_product_categories: {
                        product_categories:{
                            id: product_categories.id
                        }
                    }
                },
                relations: {
                    sub_product_categories: true
                }
            })

            return {
                status: "success",
                data: product
            }
        } catch (error) {
            throw error;
        }
    }
}
