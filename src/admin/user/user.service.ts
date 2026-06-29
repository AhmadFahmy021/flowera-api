import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/database/entities/user.entity';
import { AdminCreateUserDto, AdminUpdateUserDto } from './user.dto';

@Injectable()
export class AdminUserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /* ── List All ── */
  async findAll() {
    const users = await this.userRepository.find({
      relations: ['seller', 'seller.store', 'admin'],
      order: { createdAt: 'DESC' },
    });
    return { status: 'success', data: users };
  }

  /* ── Get One ── */
  async findOne(userId: string) {
    const id = Number(userId);
    if (isNaN(id)) throw new BadRequestException('Invalid user ID');

    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['seller', 'seller.store', 'admin'],
    });
    if (!user) throw new NotFoundException('User not found');
    return { status: 'success', data: user };
  }

  /* ── Create ── */
  async create(dto: AdminCreateUserDto) {
    // Check duplicate email
    const existing = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      throw new BadRequestException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = this.userRepository.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      ...(dto.phone_number ? { phone_number: dto.phone_number } : {}),
      ...(dto.avatar ? { avatar: dto.avatar } : {}),
    });

    await this.userRepository.save(user);
    return {
      status: 'success',
      message: 'User created successfully',
      data: user,
    };
  }

  /* ── Update ── */
  async update(userId: string, dto: AdminUpdateUserDto) {
    const id = Number(userId);
    if (isNaN(id)) throw new BadRequestException('Invalid user ID');

    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    // Check email uniqueness if changed
    if (dto.email && dto.email !== user.email) {
      const existing = await this.userRepository.findOne({
        where: { email: dto.email },
      });
      if (existing) throw new BadRequestException('Email already in use');
    }

    const updateData: any = { ...dto };
    if (dto.password) {
      updateData.password = await bcrypt.hash(dto.password, 10);
    }

    await this.userRepository.update(id, updateData);
    return { status: 'success', message: 'User updated successfully' };
  }

  /* ── Delete (soft delete) ── */
  async remove(userId: string) {
    const id = Number(userId);
    if (isNaN(id)) throw new BadRequestException('Invalid user ID');

    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    await this.userRepository.softDelete(id);
    return { status: 'success', message: 'User deleted successfully' };
  }
}
