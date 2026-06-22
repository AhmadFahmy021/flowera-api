import { BadGatewayException, BadRequestException, Injectable, NotFoundException, PreconditionFailedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seller } from '../../database/entities/seller.entity';
import { Repository } from 'typeorm';
import { StoreCreateDto, StoreUpdateDto } from './store.dto';
import { User } from 'src/database/entities/user.entity';
import { Store } from 'src/database/entities/store.entity';
import slugify from 'slugify';
import { SlugHelper } from 'src/common/helpers/slug.helper';
import { RepositoryHelper } from 'src/common/helpers/repository.helper';

@Injectable()
export class StoreService {
    constructor(
        private readonly repositoryHelper: RepositoryHelper,
        @InjectRepository(Seller) private readonly sellerRepository: Repository<Seller>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Store) private readonly storeRepository: Repository<Store>,
    ) {}

    async create(userId: number, dto: StoreCreateDto){
        try {
            const user = await this.userRepository.exists({
                where: {
                    id: userId,
                },
                select: {
                    id: true
                }
            })

            if (!user) {
                throw new NotFoundException("User is not found");
            }
            
            const sellerExist = await this.sellerRepository.exists({
                where: {
                    user: {
                        id: userId
                    }
                },
            })

            if (sellerExist) {
                throw new BadRequestException("A seller can only have one store per seller account.");
            }

            const seller = await this.repositoryHelper.createAndSave(
                this.sellerRepository, 
                {
                    user: {
                        id: userId
                    },
                }
            )


            if (!seller) {
                throw new PreconditionFailedException("Create seller failure")
            }

            const slug = SlugHelper.generate(dto.name);

            await this.repositoryHelper.createAndSave(
                this.storeRepository,
                {
                    name: dto.name,
                    slug: slug,
                    description: dto.description,
                    city: dto.city,
                    type: dto.type,
                    address: dto.address,
                    seller_id: seller.id
                }
            )


            return {
                status: "success", message: "Store successfully created"
            }
        } catch (error) {
            throw error;
        }
    }

    async update(seller_id: number, dto: StoreUpdateDto){
        try {
            const sellerExists = await this.sellerRepository.findOne({
                where: {
                    id: seller_id
                }
            })

            if (!sellerExists) {
                throw new NotFoundException("Account seller is not found");
            }

            const store = await this.storeRepository.findOne({
                where: {
                    seller_id: sellerExists.id
                }
            })

            if (!store) {
                throw new NotFoundException("Store is not found");
            }

            let slug: string | undefined;

            if (dto.name) {
                slug = SlugHelper.generate(
                    dto.name,
                );
            }

            await this.storeRepository.update({
                id: store.id
            },{
                name: dto.name,
                slug: slug,
                description: dto.description,
                city: dto.city,
                type: dto.type,
                address: dto.address,
            })


            return {
                status: "success",
                message: "Store update is successfully"
            }

        } catch (error) {
            throw error;
        }
    }

    
}
