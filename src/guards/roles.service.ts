import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Admin } from "src/database/entities/admin.entity";
import { Seller } from "src/database/entities/seller.entity";
import { Repository } from "typeorm";

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Seller)
    private readonly sellerRepository: Repository<Seller>,

    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  async isSeller(userId: number) {
    return this.sellerRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }

  async isAdmin(userId: number) {
    return this.adminRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }
}