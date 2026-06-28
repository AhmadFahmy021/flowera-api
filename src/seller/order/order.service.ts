import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Order } from 'src/database/entities/order.entity';
import { OrderItem } from 'src/database/entities/order-item.entity';
import { OrderImageConfirmed } from 'src/database/entities/order-image-confirmed.entity';

import { MinioService } from 'src/common/services/minio.service';
import { UpdateOrderStatusDto } from './order.dto';

const VALID_TRANSITIONS: Record<string, string[]> = {
  UNPAID: ['CONFIRM_SELLER'],
  CONFIRM_SELLER: ['PROSES_PENGERJAAN'],
  PROSES_PENGERJAAN: ['CONFIRM_USER'],
  CONFIRM_USER: [],
  DELIVERY: ['DITERIMA'],
  DITERIMA: [],
};

@Injectable()
export class OrderService {
  constructor(
    private readonly minioService: MinioService,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,

    @InjectRepository(OrderImageConfirmed)
    private readonly imageRepository: Repository<OrderImageConfirmed>,
  ) {}

  // ─────────────────────────────────────
  // Get Orders by Store
  // ─────────────────────────────────────
  async findAllByStore(storeId: number) {
    const orderItems = await this.orderItemRepository.find({
      where: { store_id: { id: storeId } },
      relations: ['order_id', 'order_id.user_id', 'product_id', 'product_variant_id'],
      order: { createdAt: 'DESC' },
    });

    const orderMap = new Map<number, any>();
    for (const item of orderItems) {
      if (!orderMap.has(item.order_id.id)) orderMap.set(item.order_id.id, item.order_id);
    }

    return { status: 'success', data: Array.from(orderMap.values()) };
  }

  // ─────────────────────────────────────
  // Get Order Detail
  // ─────────────────────────────────────
  async findOne(orderId: string) {
    const id = Number(orderId);
    if (isNaN(id)) throw new BadRequestException('Invalid order ID');

    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user_id', 'order_item', 'order_item.product_id', 'order_item.product_variant_id', 'order_item.store_id', 'order_image_confirmed'],
    });
    if (!order) throw new NotFoundException('Order not found');
    return { status: 'success', data: order };
  }

  // ─────────────────────────────────────
  // Update Order Status (with transition validation)
  // ─────────────────────────────────────
  async updateStatus(orderId: string, dto: UpdateOrderStatusDto) {
    const id = Number(orderId);
    if (isNaN(id)) throw new BadRequestException('Invalid order ID');

    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');

    const allowed = VALID_TRANSITIONS[order.status];
    if (!allowed || !allowed.includes(dto.status)) {
      throw new BadRequestException(
        `Cannot transition from ${order.status} to ${dto.status}. Allowed: ${allowed?.join(', ') ?? 'none'}`,
      );
    }

    const updateData: any = { status: dto.status };
    if (dto.status === 'CONFIRM_SELLER') updateData.isCustomerConfirmed = 'CONFIRMED';

    await this.orderRepository.update(id, updateData);

    return { status: 'success', message: `Order status updated to ${dto.status}` };
  }

  // ─────────────────────────────────────
  // Upload Order Image (proof of work)
  // ─────────────────────────────────────
  async uploadOrderImage(orderId: string, file: Express.Multer.File, note?: string) {
    const id = Number(orderId);
    if (isNaN(id)) throw new BadRequestException('Invalid order ID');

    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');

    if (order.status !== 'PROSES_PENGERJAAN') {
      throw new BadRequestException(`Can only upload proof when status is PROSES_PENGERJAAN. Current: ${order.status}`);
    }

    const uploadResult = await this.minioService.upload('orders/confirm', file);

    await this.imageRepository.save({
      order_id: { id: order.id } as any,
      user_id: { id: (order.user_id as any).id ?? order.user_id } as any,
      image_url: uploadResult.path,
      note: note ?? undefined,
      status: 'PENDING',
    });

    await this.orderRepository.update(order.id, { status: 'CONFIRM_USER' });

    return { status: 'success', message: 'Proof image uploaded, waiting for user confirmation', data: { image_url: uploadResult.path } };
  }
}
