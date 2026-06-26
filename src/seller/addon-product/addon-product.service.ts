import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddonProduct } from 'src/database/entities/addon-product.entity';
import { ProductImage } from 'src/database/entities/product-image.entity';
import { Repository } from 'typeorm';
import { AddOnProductCreateDto, AddProductUpdateDto } from './addon-product.dto';
import { RepositoryHelper } from 'src/common/helpers/repository.helper';
import { MinioService } from 'src/common/services/minio.service';
import { ProductVariant } from 'src/database/entities/product-variant.entity';
import { Product } from 'src/database/entities/product.entity';

@Injectable()
export class AddonProductService {
    constructor(
        private readonly repositoryHelper: RepositoryHelper,
        private readonly minioService: MinioService,
        @InjectRepository(ProductImage) private readonly productImageRepository: Repository<ProductImage>,
        @InjectRepository(ProductVariant) private readonly productVariantRepository: Repository<ProductVariant>,
        @InjectRepository(Product) private readonly productRepository: Repository<Product>,
        @InjectRepository(AddonProduct) private readonly addonProductRepository: Repository<AddonProduct>,
    ){}

    async getDataByProduct(product_id: number){
        try {
            const addon_product = await this.addonProductRepository.find({
                where: {
                    product: {
                        id: product_id
                    }
                },
                relations: {
                    product_image: true
                },
                order: {id: 'ASC'}
            })

            return {
                status: "success",
                data: addon_product
            } 
        } catch (error) {
            throw error;
        }
    }

    async create(dto: AddOnProductCreateDto, file: Express.Multer.File){
        try {
            let product;
            let product_variant;

            if (dto.product_id) {
                product = await this.productRepository.find({
                    where: {
                        id: dto.product_id
                    }
                })

                if (!product) {
                    throw new NotFoundException("Product is not found");
                }
            }

            if (dto.product_variant_id) {
                product = await this.productVariantRepository.find({
                    where: {
                        id: dto.product_variant_id
                    }
                })

                if (!product) {
                    throw new NotFoundException("Product variant is not found");
                }
            }
            const addon = await this.repositoryHelper.createAndSave(
                this.addonProductRepository,
                {
                    title: dto.title,
                    price: dto.price,
                    product: {
                        id: dto.product_id
                    }
                }
            )
            if (file) {
                const uploaded = await this.minioService.upload("addon", file)
                await this.repositoryHelper.createAndSave(this.productImageRepository, {image_url: uploaded.path, addon_product:{id: addon.id}})
            }

            return {
                status: "success",
                message: "Addon product is successfully created"
            }
        } catch (error) {
            throw error;
        }
    }

    async update(addon_product_id: number, dto: AddProductUpdateDto, file: Express.Multer.File){
        try {
            const addon_product = await this.addonProductRepository.findOne({
                where: {
                    id: addon_product_id
                }
            })

            if (!addon_product) {
                throw new NotFoundException("Addon product is not found");
            }

            const productImage = await this.productImageRepository.findOne({
                where: {
                    addon_product: {
                        id: addon_product.id
                    }
                }
            })

            if (file) {
                const image = await this.minioService.upload("variants", file)
                if (productImage) {
                    await this.minioService.delete(productImage.image_url.replace(/^\//, ""))
                    
                    await this.productImageRepository.update(
                        {addon_product: {id: addon_product.id}},
                        {
                            image_url : image.path,
                        }
                    )
                } else {
                    await this.repositoryHelper.createAndSave(
                        this.productImageRepository,
                        {
                            image_url: image.path,
                            addon_product: {
                                id: addon_product.id
                            }
                        }
                    )
                }
            }

            await this.addonProductRepository.update(
                {id: addon_product.id},
                {
                    title: dto.title,
                    price: dto.price,
                    product: {
                        id: dto.product_id
                    }
                }
            )
            
            return {
                status: "success",
                message: "Addon product is successfully updated"
            }
        } catch (error) {
            throw error;
        }
    }
    async deleted(addon_product_id: number){
        try {
            const addon_product = await this.addonProductRepository.findOne({
                where: {
                    id: addon_product_id
                }
            })

            if (!addon_product) {
                throw new NotFoundException("Addon product is not found")
            }

            const productImage = await this.productImageRepository.findOne({
                where: {
                    addon_product: {
                        id: addon_product.id
                    }
                }
            })

            if (productImage) {
                await this.minioService.delete(productImage.image_url.replace(/^\//, ""))

                await this.productImageRepository.delete({id: productImage.id, addon_product: {
                    id: addon_product.id
                }})
            }
            await this.addonProductRepository.delete({
                id: addon_product.id
            })

            return {
                status: "success",
                message: "Addon product is successfully deleted"
            }
        } catch (error) {
            
        }
    }
}
