import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/database/entities/product.entity';
import { Seller } from 'src/database/entities/seller.entity';
import { Repository } from 'typeorm';
import { ProductCreateDto, ProductUpdateDto } from './product.dto';
import { RepositoryHelper } from 'src/common/helpers/repository.helper';
import { Store } from 'src/database/entities/store.entity';
import { SlugHelper } from 'src/common/helpers/slug.helper';

@Injectable()
export class ProductService {
    constructor (
        private readonly repositoryHelper: RepositoryHelper,
        @InjectRepository(Seller) private readonly sellerRepository: Repository<Seller>,
        @InjectRepository(Product) private readonly productRepository: Repository<Product>,
        @InjectRepository(Store) private readonly storetRepository: Repository<Store>,
    ){}

    async getDataAll(seller_id: number){
        try {
            const store = await this.storetRepository.findOne({
                where: {
                    seller_id: seller_id
                }
            })

            if(!store){
                throw new NotFoundException("Store is not found")
            }

            const product = await this.productRepository.find({
                where: {
                    store_id: store.id
                }

            })            

            if (!product) {
                throw new NotFoundException("Product is not found")
            }

            return {
                status: "success",
                data: product
            }
            
        } catch (error) {
            throw error;
        }
    }

    async create(seller_id: number, dto: ProductCreateDto, sub_categories_id: number){
        try {
            const seller = await this.sellerRepository.findOne({
                where: {
                    id: seller_id
                }
            })
            if (!seller) {
                throw new NotFoundException("Seller is not found")
            }
            const store = await this.storetRepository.findOne({
                where: {
                    seller_id: seller_id
                }
            })

            if (!store) {
                throw new NotFoundException("Store is not found")
            }

            const slug = SlugHelper.generateWithTimestamp(dto.name);    

            await this.repositoryHelper.createAndSave(
                this.productRepository,
                {
                    name: dto.name,
                    slug: slug,
                    description: dto.description,
                    isLifeFlower: dto.isLifeFlower,
                    price: dto.price,
                    sub_product_categories_id: sub_categories_id,
                    store_id: store.id,
                }
            )

            return {
                status: "success",
                message: "Product successfully created"
            }
        } catch (error) {
            throw error;
        }
    }

    async update(product_id: number, dto: ProductUpdateDto){
        try {
            const product = await this.productRepository.exists({
                where: {
                    id: product_id
                }
            })

            if (!product) {
                throw new NotFoundException("Product is not found")
            }

            let slug: string | undefined;

            if (dto.name) {
                slug = SlugHelper.generateWithTimestamp(
                    dto.name,
                );
            }

            await this.productRepository.update(
                {id: product_id},
                {
                    name: dto.name,
                    slug: slug,
                    description: dto.description,
                    price: dto.price,
                    isLifeFlower: dto.isLifeFlower,
                }
            )

            return {
                status: "success",
                message: "Product is successfully updated"
            }
        } catch (error) {
            throw error;
        }
    }

    async delete(product_id: number){
        try {
            const product = await this.productRepository.exists({
                where: {
                    id: product_id
                }
            })

            if (!product) {
                throw new NotFoundException("Product is not found")
            }

            await this.productRepository.delete({id: product_id})

            return {
                status: "success",
                message: "Product is successfully deleted"
            }
        } catch (error) {
            
        }
    }
}
