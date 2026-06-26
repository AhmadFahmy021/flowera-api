import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { Profile } from 'src/database/entities/profile.entity';
import { Address } from 'src/database/entities/address.entity';
import { DeepPartial, Repository } from 'typeorm';
import {
  UpdateProfileDto,
  CreateAddressDto,
  UpdateAddressDto,
} from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  async getProfile(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'name', 'phone_number', 'email', 'avatar'],
    });

    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }

    const profile = await this.profileRepository.findOne({
      where: { user_id: userId },
      relations: ['address'],
    });

    return {
      status: 'success',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone_number: user.phone_number,
        avatar: user.avatar,
        birth_place: profile?.birth_place ?? null,
        birt_date: profile?.birt_date ?? null,
        gender: profile?.gender ?? null,
        no_hp: profile?.no_hp ?? null,
        addresses: profile?.address ?? [],
      },
    };
  }

  async updateProfile(userId: number, dto: UpdateProfileDto) {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }

    // Update USERS table fields
    const userUpdate: Record<string, unknown> = {};
    if (dto.name !== undefined) userUpdate.name = dto.name;
    if (dto.phone_number !== undefined)
      userUpdate.phone_number = dto.phone_number;

    if (Object.keys(userUpdate).length > 0) {
      await this.userRepository.update(userId, userUpdate);
    }

    // Update/Create PROFILE table fields
    const profileFields: Record<string, unknown> = {};
    if (dto.birth_place !== undefined)
      profileFields.birth_place = dto.birth_place;
    if (dto.birt_date !== undefined)
      profileFields.birt_date = new Date(dto.birt_date);
    if (dto.gender !== undefined) profileFields.gender = dto.gender;
    if (dto.no_hp !== undefined) profileFields.no_hp = dto.no_hp;

    if (Object.keys(profileFields).length > 0) {
      const existingProfile = await this.profileRepository.findOne({
        where: { user_id: userId },
      });

      if (!existingProfile) {
        const newProfile = this.profileRepository.create({
          user_id: userId,
          birth_place: '-',
          birt_date: new Date(),
          gender: '-',
          no_hp: '-',
          ...profileFields,
        } as DeepPartial<Profile>);
        await this.profileRepository.save(newProfile);
      } else {
        await this.profileRepository.update(existingProfile.id, profileFields);
      }
    }

    return this.getProfile(userId);
  }

  // ─── Addresses ──────────────────────────────────────────

  async getAddresses(userId: number) {
    const profile = await this.profileRepository.findOne({
      where: { user_id: userId },
    });

    if (!profile) {
      return { status: 'success', data: [] };
    }

    const addresses = await this.addressRepository.find({
      where: { profile_id: profile.id } as any,
    });

    return {
      status: 'success',
      data: addresses,
    };
  }

  async createAddress(userId: number, dto: CreateAddressDto) {
    let profile = await this.profileRepository.findOne({
      where: { user_id: userId },
    });

    if (!profile) {
      profile = this.profileRepository.create({
        user_id: userId,
        birth_place: '-',
        birt_date: new Date(),
        gender: '-',
        no_hp: '-',
      } as DeepPartial<Profile>);
      profile = await this.profileRepository.save(profile);
    }

    const address = this.addressRepository.create({
      profile_id: profile.id,
      nama_penerima: dto.nama_penerima,
      no_hp: dto.no_hp,
      address: dto.address,
      note: dto.note,
    } as any);

    const saved = await this.addressRepository.save(address);

    return {
      status: 'success',
      message: 'Alamat berhasil ditambahkan',
      data: saved,
    };
  }

  async updateAddress(
    userId: number,
    addressId: number,
    dto: UpdateAddressDto,
  ) {
    const profile = await this.profileRepository.findOne({
      where: { user_id: userId },
    });

    if (!profile) {
      throw new NotFoundException('Profile tidak ditemukan');
    }

    const address = await this.addressRepository.findOne({
      where: { id: addressId, profile_id: profile.id } as any,
    });

    if (!address) {
      throw new NotFoundException('Alamat tidak ditemukan');
    }

    const updateData: Record<string, unknown> = {};
    if (dto.nama_penerima !== undefined)
      updateData.nama_penerima = dto.nama_penerima;
    if (dto.no_hp !== undefined) updateData.no_hp = dto.no_hp;
    if (dto.address !== undefined)
      updateData.address = dto.address;
    if (dto.note !== undefined)
      updateData.note = dto.note;

    if (Object.keys(updateData).length === 0) {
      throw new BadRequestException('Tidak ada field yang diupdate');
    }

    await this.addressRepository.update(addressId as any, updateData);

    return {
      status: 'success',
      message: 'Alamat berhasil diupdate',
    };
  }

  async deleteAddress(userId: number, addressId: number) {
    const profile = await this.profileRepository.findOne({
      where: { user_id: userId },
    });

    if (!profile) {
      throw new NotFoundException('Profile tidak ditemukan');
    }

    const address = await this.addressRepository.findOne({
      where: { id: addressId, profile_id: profile.id } as any,
    });

    if (!address) {
      throw new NotFoundException('Alamat tidak ditemukan');
    }

    await this.addressRepository.delete(addressId as any);

    return {
      status: 'success',
      message: 'Alamat berhasil dihapus',
    };
  }
}
