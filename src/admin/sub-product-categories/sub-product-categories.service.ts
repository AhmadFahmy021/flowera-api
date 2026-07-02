import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RepositoryHelper } from 'src/common/helpers/repository.helper';
import { Product } from 'src/database/entities/product.entity';
import { ProducCategories } from 'src/database/entities/prouct-categories.entity';
import { SubProductCategories } from 'src/database/entities/sub-product_categories.entity';
import { Repository } from 'typeorm';
import { SubProductCategoriesCreateDto, SubProductCategoriesUpdateDto } from './sub-product-categories.dto';

@Injectable()
export class SubProductCategoriesService {
    constructor(
        private readonly repositoryHelper: RepositoryHelper,
        @InjectRepository(SubProductCategories) private readonly subProductCategoriesRepository: Repository<SubProductCategories>,
        @InjectRepository(Product) private readonly productRepository: Repository<Product>,
        @InjectRepository(ProducCategories) private readonly productCategoriesRepository: Repository<ProducCategories>,
    ){}

    async getAllData(){
        try {
            const sub_product_categories = await this.subProductCategoriesRepository.find({
                relations: ['product_categories']
            })

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
            const productCategory = await this.productCategoriesRepository.findOne({
                where: { id: dto.sub_product_categories_id }
            })

            if (!productCategory) {
                throw new NotFoundException("Product category is not found")
            }

            await this.repositoryHelper.createAndSave(
                this.subProductCategoriesRepository,
                {
                    title: dto.title,
                    product_categories: productCategory
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
            const sub_product_categories = await this.subProductCategoriesRepository.findOne({
                where: {
                    id: sub_product_categories_id
                }
            })

            if (!sub_product_categories) {
                throw new NotFoundException("Sub product categories is not found")
            }

            const updateData: any = {};

            if (dto.title !== undefined) {
                updateData.title = dto.title;
            }

            if (dto.sub_product_categories_id !== undefined) {
                const productCategory = await this.productCategoriesRepository.findOne({
                    where: { id: dto.sub_product_categories_id }
                })

                if (!productCategory) {
                    throw new NotFoundException("Product category is not found")
                }

                updateData.product_categories = productCategory;
            }

            if (Object.keys(updateData).length === 0) {
                return {
                    status: "success",
                    message: "No changes to update"
                }
            }

            await this.subProductCategoriesRepository.update(
                {id: sub_product_categories_id},
                updateData
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
