import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Order } from 'src/database/entities/order.entity';

import { UpdateOrderStatusDto } from './order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  // ─────────────────────────────────────
  // Get All Orders (admin)
  // ─────────────────────────────────────
  async findAll() {
    const orders = await this.orderRepository.find({
      relations: [
        'user_id',
        'order_item',
        'order_item.product_id',
        'order_item.product_variant_id',
        'order_item.store_id',
        'payment_order',
      ],
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      status: 'success',
      data: orders,
    };
  }

  // ─────────────────────────────────────
  // Get Order Detail (admin)
  // ─────────────────────────────────────
  async findOne(orderId: string) {
    const id = Number(orderId);
    if (isNaN(id)) throw new BadRequestException('Invalid order ID');

    const order = await this.orderRepository.findOne({
      where: { id },
      relations: [
        'user_id',
        'order_item',
        'order_item.product_id',
        'order_item.product_variant_id',
        'order_item.store_id',
      ],
    });

    if (!order) throw new NotFoundException('Order not found');

    return { status: 'success', data: order };
  }

  // ─────────────────────────────────────
  // Update Order Status (admin)
  // ─────────────────────────────────────
  async updateStatus(orderId: string, dto: UpdateOrderStatusDto) {
    const id = Number(orderId);
    if (isNaN(id)) throw new BadRequestException('Invalid order ID');

    const order = await this.orderRepository.findOne({ where: { id } });

    if (!order) throw new NotFoundException('Order not found');

    const updateData: any = { status: dto.status };

    await this.orderRepository.update(id, updateData);

    return { status: 'success', message: `Order status updated to ${dto.status}` };
  }
}
