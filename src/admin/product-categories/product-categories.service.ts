import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RepositoryHelper } from 'src/common/helpers/repository.helper';
import { ProducCategories } from 'src/database/entities/prouct-categories.entity';
import { Repository } from 'typeorm';
import { ProductCategoriesCreateDto, ProductCategoriesUpdateDto } from './product-categories.dto';
import { SubProductCategories } from 'src/database/entities/sub-product_categories.entity';
import { Product } from 'src/database/entities/product.entity';

@Injectable()
export class ProductCategoriesService {
    constructor(

        private readonly repositoryHelper: RepositoryHelper,
        @InjectRepository(ProducCategories) private readonly productCategoriesRepository: Repository<ProducCategories>,
        @InjectRepository(SubProductCategories) private readonly subProductCategoriesRepository: Repository<SubProductCategories>,
        @InjectRepository(Product) private readonly productRepository: Repository<Product>,
    ){}

    async getDataAll(){
        try {
            const product_categories = await this.productCategoriesRepository.find();
            return {
                status: "success",
                data: product_categories
            }
        } catch (error) {
            throw error;
        }
    }
    async create(dto: ProductCategoriesCreateDto){
        try {
            await this.repositoryHelper.createAndSave(
                this.productCategoriesRepository,
                {
                    title: dto.title
                }
            )

            return {
                status: "success",
                message: "Product categories is successfully created"
            }
        } catch (error) {
            throw error;
        }
    }

    async update(product_categories_id: number, dto: ProductCategoriesUpdateDto){
        console.log(product_categories_id);
        
        try {
            const product_categories = await this.productCategoriesRepository.findOne({
                where: {
                    id: product_categories_id
                }
            })

            if (!product_categories) {
                throw new NotFoundException("Product categories is not found")
            }

            await this.productCategoriesRepository.update(
                {id: product_categories_id},
                {
                    title: dto.title
                }
            )

            return {
                status: "success",
                message: "Product categories is successfully updated"
            }
        } catch (error) {
            throw error;
        }
    }

    async deleted(product_categories_id: number){
        try {
            const product_categories = await this.productCategoriesRepository.findOne({
                where: {
                    id: product_categories_id
                }
            })

            if (!product_categories) {
                throw new NotFoundException("Product categories is not found")
            }

            const subProductCategories =
                await this.subProductCategoriesRepository.find({
                    where: {
                    product_categories: {
                        id: product_categories.id,
                    },
                    },
            });

            for (const subCategory of subProductCategories) {
                const isUsed =
                    await this.productRepository.exists({
                    where: {
                        sub_product_categories: {
                            id: subCategory.id,
                        },
                    },
                    });

                if (isUsed) {
                    throw new BadRequestException(
                        `Kategori tidak dapat dihapus karena Sub Kategori "${subCategory.title}" masih digunakan oleh produk.`,
                    );
                }
            }

            await this.subProductCategoriesRepository.delete({product_categories: {id: product_categories.id}})

            await this.productCategoriesRepository.delete({id: product_categories.id})
            
            return {
                status: "success",
                message: "Product categories is successfully deleted"
            }
        } catch (error) {
            throw error;
        }
    }
}
