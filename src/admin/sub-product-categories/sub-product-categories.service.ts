import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RepositoryHelper } from 'src/common/helpers/repository.helper';
import { Product } from 'src/database/entities/product.entity';
import { SubProductCategories } from 'src/database/entities/sub-product_categories.entity';
import { Repository } from 'typeorm';
import { SubProductCategoriesCreateDto, SubProductCategoriesUpdateDto } from './sub-product-categories.dto';

@Injectable()
export class SubProductCategoriesService {
    constructor(
        private readonly repositoryHelper: RepositoryHelper,
        @InjectRepository(SubProductCategories) private readonly subProductCategoriesRepository: Repository<SubProductCategories>,
        @InjectRepository(Product) private readonly productRepository: Repository<Product>,
    ){}

    async getAllData(){
        try {
            const sub_product_categories = await this.subProductCategoriesRepository.find()

            return {
                status: "success",
                data: sub_product_categories
            }
        } catch (error) {
            throw error;
        }
    }

    async create(dto: SubProductCategoriesCreateDto){
        try {
            await this.repositoryHelper.createAndSave(
                this.subProductCategoriesRepository,
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

    async update(sub_product_categories_id: number, dto: SubProductCategoriesUpdateDto){
        try {
            const product_categories = await this.subProductCategoriesRepository.findOne({
                where: {
                    id: sub_product_categories_id
                }
            })

            if (!product_categories) {
                throw new NotFoundException("Sub product categories is not found")
            }

            await this.subProductCategoriesRepository.update(
                {id: sub_product_categories_id},
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

    async deleted(sub_product_categories_id: number){
        try {
            const sub_product_categories = await this.subProductCategoriesRepository.findOne({
                where: {
                    id: sub_product_categories_id
                }
            })

            if (!sub_product_categories) {
                throw new NotFoundException("Product categories is not found")
            }

            const product = await this.productRepository.exists({
                where: {
                    sub_product_categories: {
                        id: sub_product_categories_id
                    }
                }
            })
            
            if (product) {
                throw new BadRequestException("Sub-product categories cannot be deleted")
            }

            await this.subProductCategoriesRepository.delete({id: sub_product_categories_id})
            
            return {
                status: "success",
                message: "Product categories is successfully deleted"
            }
        } catch (error) {
            throw error;
        }
    }
}
