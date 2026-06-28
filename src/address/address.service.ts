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
        const user = await this.userRepository.exists({
            where: { id: userId },
        });
        if (!user) throw new NotFoundException('User is not found');

        let profile = await this.profileRepository.findOne({
            where: { user_id: { id: userId } },
        });

        // Auto-create profile if not exists
        if (!profile) {
            profile = await this.repositoryHelper.createAndSave(
                this.profileRepository,
                {
                    user_id: { id: userId },
                    birth_place: '-',
                    birth_date: new Date(),
                    gender: '-',
                    no_hp: '-',
                },
            );
        }

        await this.repositoryHelper.createAndSave(
            this.addressRepository,
            {
                profile_id: { id: profile.id },
                nama_penerima: dto.nama_penerima,
                no_hp: dto.no_hp,
                address: dto.address,
                note: dto.note ?? undefined,
                province_name: dto.province_name ?? undefined,
                city_name: dto.city_name ?? undefined,
                district_name: dto.district_name ?? undefined,
                subdistrict_name: dto.subdistrict_name ?? undefined,
                zip_code: dto.zip_code ?? undefined,
                subdistrict_id: dto.subdistrict_id ?? undefined,
            },
        );

        return { status: 'success', message: 'Address successfully created' };
    }

    async findAll(userId: number) {
        const profile = await this.profileRepository.findOne({
            where: { user_id: { id: userId } },
        });
        if (!profile) throw new NotFoundException('Profile is not found');

        const addresses = await this.addressRepository.find({
            where: { profile_id: { id: profile.id } },
            order: { createdAt: 'DESC' },
        });

        return {
            status: 'success',
            data: addresses.map((a) => this.formatAddress(a)),
        };
    }

    async findOne(userId: number, id: string) {
        const profile = await this.profileRepository.findOne({
            where: { user_id: { id: userId } },
        });
        if (!profile) throw new NotFoundException('Profile is not found');

        const address = await this.addressRepository.findOne({
            where: { id: Number(id), profile_id: { id: profile.id } },
        });
        if (!address) throw new NotFoundException('Address is not found');

        return {
            status: 'success',
            data: this.formatAddress(address),
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

    // ─────────────────────────────────────
    // Format address like RajaOngkir response
    // ─────────────────────────────────────
    private formatAddress(a: any) {
        const label = [
            a.subdistrict_name,
            a.district_name,
            a.city_name,
            a.province_name,
            a.zip_code,
        ]
            .filter(Boolean)
            .join(', ');

        return {
            id: a.id,
            label: label || null,
            nama_penerima: a.nama_penerima,
            no_hp: a.no_hp,
            address: a.address,
            note: a.note,
            province_name: a.province_name,
            city_name: a.city_name,
            district_name: a.district_name,
            subdistrict_name: a.subdistrict_name,
            zip_code: a.zip_code,
            subdistrict_id: a.subdistrict_id,
            created_at: a.createdAt,
            updated_at: a.updatedAt,
        };
    }
}