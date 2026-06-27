import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'src/database/entities/user.entity';
import { Profile } from 'src/database/entities/profile.entity';

import { RepositoryHelper } from 'src/common/helpers/repository.helper';

import { ProfileUpdateDto } from './profile.dto';

@Injectable()
export class ProfileService {

  constructor(
    private readonly repositoryHelper: RepositoryHelper,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async detail(userId: number) {
    const user = await this.userRepository.exists({
      where: {
        id: userId,
      },
      select: {
        id: true,
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
      throw new NotFoundException('Profile is not found');
    }

    return {
      status: 'success',
      data: profile,
    };
  }

  async update(userId: number, dto: ProfileUpdateDto) {
  const user = await this.userRepository.findOne({
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
    await this.repositoryHelper.createAndSave(
      this.profileRepository,
      {
        user_id: {
          id: userId,
        },
        birth_place: dto.birth_place,
        birth_date: dto.birth_date,
        gender: dto.gender,
        no_hp: dto.no_hp,
      },
    );

    return {
      status: 'success',
      message: 'Profile successfully created',
    };
  }

  await this.profileRepository.update(
    {
      id: profile.id,
    },
    {
      birth_place: dto.birth_place,
      birth_date: dto.birth_date,
      gender: dto.gender,
      no_hp: dto.no_hp,
    },
  );

  return {
    status: 'success',
    message: 'Profile successfully updated',
  };
}

  

}