import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RepositoryHelper } from 'src/common/helpers/repository.helper';
import { ProductVariant } from 'src/database/entities/product-variant.entity';
import { Product } from 'src/database/entities/product.entity';
import { Store } from 'src/database/entities/store.entity';
import { Repository } from 'typeorm';
import { ProductVariantCreateDto, ProductVariantUpdateDto } from './product-variant.dto';
import { ProductImage } from 'src/database/entities/product-image.entity';
import { UploadHelper } from 'src/common/helpers/upload.helper';
import { MinioService } from 'src/common/services/minio.service';

@Injectable()
export class ProductVariantService {
    constructor (
        private readonly repositoryHelper : RepositoryHelper,
        private readonly minioService : MinioService,
        @InjectRepository(ProductVariant) private readonly productVariantRepository: Repository<ProductVariant>,
        @InjectRepository(Store) private readonly storeRepository: Repository<Store>,
        @InjectRepository(Product) private readonly productRepository: Repository<Product>,
        @InjectRepository(ProductImage) private readonly productImageRepository: Repository<ProductImage>,
    ){}

    async getAllDataProductVariantByProductId(seller_id: number, product_id: number){
        try {
            const store = await this.storeRepository.findOne({
                where: {
                    seller: {
                        id: seller_id
                    }
                }
            })

            if (!store) {
                throw new NotFoundException("Store is not found")                
            }

            const product = await this.productRepository.findOne({
                where: {
                    id: product_id
                }
            })

            if (!product) {
                throw new NotFoundException("Product is not found")
            }

            const product_variant = await this.productVariantRepository.find({
                where: {
                    product: {
                        id: product.id
                    }
                },
                relations: {
                    product_image: true
                }
            })


            return {
                status: "success",
                data: product_variant
            }
        } catch (error) {
            throw error;
        }
    }

        async create(product_id: number, dto: ProductVariantCreateDto, file: Express.Multer.File){
            try {
                const product = await this.productRepository.findOne({
                    where: {
                        id: product_id
                    }
                })

                if (!product) {
                    throw new NotFoundException("Product is not found")
                }
                
                const variant = await this.repositoryHelper.createAndSave(
                    this.productVariantRepository,
                    {
                        title: dto.title,
                        subTitle: dto.sub_title,
                        price: dto.price,
                        product: {
                            id: product_id
                        }
                    }
                )
                

                if (file) {
                    const uploaded = await this.minioService.upload("variants", file)

                    await this.repositoryHelper.createAndSave(this.productImageRepository, {image_url: uploaded.path, product_variant:{id: variant.id}})
                }
                return {
                    status: "success",
                    message: "Product variant is successfully created"
                }
            } catch (error) {
                throw error;
            }
        }

    async update(product_variant_id: number, dto: ProductVariantUpdateDto, file: Express.Multer.File){
        try {
            const product_variant = await this.productVariantRepository.findOne({
                where: {
                    id: product_variant_id
                }
            })

            if (!product_variant) {
                throw new NotFoundException("Product is not found")
            }

            const productImage = await this.productImageRepository.findOne({
                where: {
                    product_variant: {
                        id: product_variant.id
                    }
                }
            })

            if (file) {
                const image = await this.minioService.upload("variants", file)
                if (productImage) {
                    await this.minioService.delete(productImage.image_url.replace(/^\//, ""))
                    
                    await this.productImageRepository.update(
                        {product_variant: {id: product_variant.id}},
                        {
                            image_url : image.path,
                        }
                    )
                } else {
                    await this.repositoryHelper.createAndSave(
                        this.productImageRepository,
                        {
                            image_url: image.path,
                            product_variant: {
                                id: product_variant.id
                            }
                        }
                    )
                }
            }

            await this.productVariantRepository.update(
                {id: product_variant_id},
                {
                    title: dto.title,
                    subTitle: dto.sub_title,
                    price: dto.price,
                    
                }
            )

            return {
                status: "success",
                message: "Product variant is successfully updated"
            }
        } catch (error) {
            throw error;
        }
    }

    async deleted(product_variant_id: number){
        try {
            const product_variant = await this.productVariantRepository.findOne({
                where: {
                    id: product_variant_id
                }
            })

            if (!product_variant) {
                throw new NotFoundException("Product variant is not found")
            }

            const productImage = await this.productImageRepository.findOne({
                where: {
                    product_variant: {
                        id: product_variant.id
                    }
                }
            })

            if (productImage) {
                await this.minioService.delete(productImage.image_url.replace(/^\//, ""))

                await this.productImageRepository.delete({id: productImage.id, product_variant: {
                    id: product_variant.id
                }})
            }

            await this.productVariantRepository.delete({id: product_variant_id})

            return {
                status: "success",
                message: "Product variant is successfully deleted"
            }
        } catch (error) {
            throw error;
        }
    }
}
