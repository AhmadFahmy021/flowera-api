import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Seller } from 'src/database/entities/seller.entity';
import { User } from 'src/database/entities/user.entity';
import { Store } from 'src/database/entities/store.entity';
import { AdminCreateSellerDto, AdminUpdateSellerDto } from './seller.dto';

@Injectable()
export class AdminSellerService {
  constructor(
    @InjectRepository(Seller)
    private readonly sellerRepository: Repository<Seller>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  /* ── List All ── */
  async findAll() {
    const sellers = await this.sellerRepository.find({
      relations: ['user', 'store'],
      order: { createdAt: 'DESC' },
    });
    return { status: 'success', data: sellers };
  }

  /* ── Get One ── */
  async findOne(sellerId: string) {
    const id = Number(sellerId);
    if (isNaN(id)) throw new BadRequestException('Invalid seller ID');

    const seller = await this.sellerRepository.findOne({
      where: { id },
      relations: ['user', 'store'],
    });
    if (!seller) throw new NotFoundException('Seller not found');
    return { status: 'success', data: seller };
  }

  /* ── Create ── */
  async create(dto: AdminCreateSellerDto) {
    // 1. Check duplicate email
    const existing = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (existing) throw new BadRequestException('Email already registered');

    // 2. Create user
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.userRepository.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      ...(dto.phone_number ? { phone_number: dto.phone_number } : {}),
    });
    await this.userRepository.save(user);

    // 3. Create seller record
    const seller = this.sellerRepository.create({ user });
    await this.sellerRepository.save(seller);

    // 4. Optionally create store
    if (dto.store_name) {
      const slug =
        dto.store_name.toLowerCase().replace(/\s+/g, '-') +
        '-' +
        Date.now();

      const store = this.storeRepository.create({
        name: dto.store_name,
        slug,
        address: dto.store_address ?? '',
        type: dto.store_type ?? 'TOKO',
        description: dto.store_description ?? '',
        city: dto.city ?? '',
        province_name: dto.province_name ?? '',
        city_name: dto.city_name ?? '',
        district_name: dto.district_name ?? '',
        subdistrict_name: dto.subdistrict_name ?? '',
        zip_code: dto.zip_code ?? '',
        subdistrict_id: dto.subdistrict_id ?? '',
        seller,
      });
      await this.storeRepository.save(store);
    }

    return {
      status: 'success',
      message: 'Seller created successfully',
      data: seller,
    };
  }

  /* ── Update ── */
  async update(sellerId: string, dto: AdminUpdateSellerDto) {
    const id = Number(sellerId);
    if (isNaN(id)) throw new BadRequestException('Invalid seller ID');

    const seller = await this.sellerRepository.findOne({
      where: { id },
      relations: ['user', 'store'],
    });
    if (!seller) throw new NotFoundException('Seller not found');

    // Update user fields
    if (dto.name || dto.email || dto.password || dto.phone_number) {
      const userUpdate: any = {};
      if (dto.name) userUpdate.name = dto.name;
      if (dto.email) {
        // Check uniqueness
        if (dto.email !== seller.user.email) {
          const existing = await this.userRepository.findOne({
            where: { email: dto.email },
          });
          if (existing) throw new BadRequestException('Email already in use');
        }
        userUpdate.email = dto.email;
      }
      if (dto.password) {
        userUpdate.password = await bcrypt.hash(dto.password, 10);
      }
      if (dto.phone_number !== undefined) userUpdate.phone_number = dto.phone_number;

      await this.userRepository.update(seller.user.id, userUpdate);
    }

    // Update store fields
    if (
      dto.store_name ||
      dto.store_address ||
      dto.store_type ||
      dto.store_description ||
      dto.city ||
      dto.province_name ||
      dto.city_name ||
      dto.district_name ||
      dto.subdistrict_name ||
      dto.zip_code ||
      dto.subdistrict_id
    ) {
      if (seller.store) {
        const storeUpdate: any = {};
        if (dto.store_name) storeUpdate.name = dto.store_name;
        if (dto.store_address) storeUpdate.address = dto.store_address;
        if (dto.store_type) storeUpdate.type = dto.store_type;
        if (dto.store_description) storeUpdate.description = dto.store_description;
        if (dto.city) storeUpdate.city = dto.city;
        if (dto.province_name) storeUpdate.province_name = dto.province_name;
        if (dto.city_name) storeUpdate.city_name = dto.city_name;
        if (dto.district_name) storeUpdate.district_name = dto.district_name;
        if (dto.subdistrict_name) storeUpdate.subdistrict_name = dto.subdistrict_name;
        if (dto.zip_code) storeUpdate.zip_code = dto.zip_code;
        if (dto.subdistrict_id) storeUpdate.subdistrict_id = dto.subdistrict_id;
        await this.storeRepository.update(seller.store.id, storeUpdate);
      } else if (dto.store_name) {
        // Create store if seller doesn't have one yet
        const slug =
          dto.store_name.toLowerCase().replace(/\s+/g, '-') +
          '-' +
          Date.now();
        const store = this.storeRepository.create({
          name: dto.store_name,
          slug,
          address: dto.store_address ?? '',
          type: dto.store_type ?? 'TOKO',
          description: dto.store_description ?? '',
          city: dto.city ?? '',
          province_name: dto.province_name ?? '',
          city_name: dto.city_name ?? '',
          district_name: dto.district_name ?? '',
          subdistrict_name: dto.subdistrict_name ?? '',
          zip_code: dto.zip_code ?? '',
          subdistrict_id: dto.subdistrict_id ?? '',
          seller,
        });
        await this.storeRepository.save(store);
      }
    }

    return { status: 'success', message: 'Seller updated successfully' };
  }

  /* ── Delete (soft delete) ── */
  async remove(sellerId: string) {
    const id = Number(sellerId);
    if (isNaN(id)) throw new BadRequestException('Invalid seller ID');

    const seller = await this.sellerRepository.findOne({
      where: { id },
      relations: ['user', 'store'],
    });
    if (!seller) throw new NotFoundException('Seller not found');

    // Soft delete store if exists
    if (seller.store) {
      await this.storeRepository.softDelete(seller.store.id);
    }

    // Soft delete seller
    await this.sellerRepository.softDelete(id);

    // Soft delete user
    await this.userRepository.softDelete(seller.user.id);

    return { status: 'success', message: 'Seller deleted successfully' };
  }
}
