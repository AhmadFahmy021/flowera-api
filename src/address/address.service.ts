import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'src/database/entities/user.entity';
import { Profile } from 'src/database/entities/profile.entity';
import { Address } from 'src/database/entities/address.entity';

import { RepositoryHelper } from 'src/common/helpers/repository.helper';
import { AddressCreateDto, AddressUpdateDto } from './address.dto';

@Injectable()
export class AddressService {
    constructor(
        private readonly repositoryHelper: RepositoryHelper,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(Profile)
        private readonly profileRepository: Repository<Profile>,

        @InjectRepository(Address)
        private readonly addressRepository: Repository<Address>,
    ) { }

    async create(userId: number, dto: AddressCreateDto) {
        try {
            const user = await this.userRepository.exists({
                where: {
                    id: userId,
                },
            });

            if (!user) {
                throw new NotFoundException('User is not found');
            }

            const profile = await this.profileRepository.findOne({
                where: {
                    user_id: {
                        id: userId,
                    },
                },
            });

            if (!profile) {
                throw new BadRequestException(
                    'Please complete your profile first',
                );
            }

            await this.repositoryHelper.createAndSave(
                this.addressRepository,
                {
                    profile_id: {
                        id: profile.id,
                    },
                    nama_penerima: dto.nama_penerima,
                    no_hp: dto.no_hp,
                    address: dto.address,
                    note: dto.note,
                },
            );

            return {
                status: 'success',
                message: 'Address successfully created',
            };
        } catch (error) {
            throw error;
        }
    }

    async findAll(userId: number) {
        const profile = await this.profileRepository.findOne({
            where: {
                user_id: {
                    id: userId,
                },
            },
        });

        if (!profile) {
            throw new NotFoundException('Profile is not found');
        }

        const addresses = await this.addressRepository.find({
            where: {
                profile_id: {
                    id: profile.id,
                },
            },
            order: {
                createdAt: 'DESC',
            },
        });

        return {
            status: 'success',
            data: addresses,
        };
    }

    async findOne(userId: number, id: string) {
        const profile = await this.profileRepository.findOne({
            where: {
                user_id: {
                    id: userId,
                },
            },
        });

        if (!profile) {
            throw new NotFoundException('Profile is not found');
        }

        const address = await this.addressRepository.findOne({
            where: {
                id: Number(id),
                profile_id: {
                    id: profile.id,
                },
            },
        });

        if (!address) {
            throw new NotFoundException('Address is not found');
        }

        return {
            status: 'success',
            data: address,
        };
    }

    async update(
        userId: number,
        id: string,
        dto: AddressUpdateDto,
    ) {
        const profile = await this.profileRepository.findOne({
            where: {
                user_id: {
                    id: userId,
                },
            },
        });

        if (!profile) {
            throw new NotFoundException('Profile is not found');
        }

        const address = await this.addressRepository.findOne({
            where: {
                id: Number(id),
                profile_id: {
                    id: profile.id,
                },
            },
        });

        if (!address) {
            throw new NotFoundException('Address is not found');
        }

        Object.assign(address, dto);

        await this.addressRepository.save(address);

        return {
            status: 'success',
            message: 'Address successfully updated',
        };
    }

    async remove(userId: number, id: string) {
        const profile = await this.profileRepository.findOne({
            where: {
                user_id: {
                    id: userId,
                },
            },
        });

        if (!profile) {
            throw new NotFoundException('Profile is not found');
        }

        const address = await this.addressRepository.findOne({
            where: {
                id: Number(id),
                profile_id: {
                    id: profile.id,
                },
            },
        });

        if (!address) {
            throw new NotFoundException('Address is not found');
        }

        await this.addressRepository.softRemove(address);

        return {
            status: 'success',
            message: 'Address successfully deleted',
        };
    }
}