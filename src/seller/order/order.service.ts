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
import { Store } from 'src/database/entities/store.entity';
import { NotificationService } from 'src/common/services/notification.service';

const SELLER_TRANSITIONS: Record<string, string[]> = {
  PAID: [
    "CONFIRM_SELLER",
  ],

  CONFIRM_SELLER: [
    "PROSES_PENGERJAAN",
  ],

  PROSES_PENGERJAAN: [
    "CONFIRM_USER",
  ],

  CONFIRM_USER: [],

  CONFIRM_RECEIVED: [
    "DELIVERY",
  ],

  DELIVERY: [],

  DITERIMA: [],
};

@Injectable()
export class OrderService {
  constructor(
    private readonly minioService: MinioService,
    private readonly notificationService: NotificationService,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,

    @InjectRepository(OrderImageConfirmed)
    private readonly imageRepository: Repository<OrderImageConfirmed>,

    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  // ─────────────────────────────────────
  // Get Orders by Store
  // ─────────────────────────────────────
  async findAllByStore(seller_id: number) {
    const store = await this.storeRepository.findOne({
        where: {
            seller: {
                id: seller_id
            }
        }
    })
    if (!store) {
        throw new NotFoundException("Store not found")
    }
    // const orderItems = await this.orderItemRepository.find({
    //   where: { store_id: { id: store?.id } },
    //   select: {
    //     order_id: {
    //         user_id: {
    //             name: true
    //         }
    //     }
    //   },
    //   relations: ['order_id', 'order_id.user_id', 'product_id', 'product_variant_id'],
    //   order: { createdAt: 'DESC' },
    // });

    const orderItems = await this.orderItemRepository.find({
        where: {
            store_id: {
            id: store.id,
            },
        },
        relations: [
            "order_id",
            "order_id.user_id",
            "product_id",
            "product_variant_id",
            "order_id.address",
        ],
        withDeleted: true,
        select: {
            id: true,
            order_id: {
                id: true,
                orderNumber: true,
                status: true,
                total: true,
                createdAt: true,

                user_id: {
                    id: true,
                    name: true,
                    email: true,
                },
                address: {
                    nama_penerima: true,
                    no_hp: true,
                    address: true,
                    note: true,
                    province_name: true,
                    city_name: true,
                    district_name: true,
                    subdistrict_name: true,
                    zip_code: true,
                    subdistrict_id: true,
                }
            },

            product_id: {
            id: true,
            name: true,
            price: true,
            },

            product_variant_id: {
            id: true,
            title: true,
            price: true,
            },

            quantity: true,
            price: true,
            subTotal: true,
        },
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

    if (isNaN(id)) {
      throw new BadRequestException("Invalid order ID");
    }

    const order = await this.orderRepository.findOne({
      where: { id },
      relations: [
        "user_id",
        "order_item",
        "order_item.product_id",
        "order_item.store_id",
      ],
    });

    if (!order) {
      throw new NotFoundException("Order not found");
    }

    const allowedTransitions = SELLER_TRANSITIONS[order.status] ?? [];

    if (!allowedTransitions.includes(dto.status)) {
      throw new BadRequestException(
        `Cannot transition from ${order.status} to ${dto.status}. Allowed: ${allowedTransitions.join(", ")}`
      );
    }

    const updateData: Partial<Order> = {
      status: dto.status,
    };

    switch (dto.status) {
      case "CONFIRM_SELLER":
        updateData.status = "CONFIRM_SELLER";
        break;
        
      case "PROSES_PENGERJAAN":
        updateData.status = "PROSES_PENGERJAAN";
        // future logic
        break;

      case "CONFIRM_USER":{
        const latestImage = await this.imageRepository.findOne({
            where: {
                order_id: {
                    id: order.id,
                },
            },
            order: {
                createdAt: "DESC",
            },
        });

          if (!latestImage) {
              throw new BadRequestException(
                  "Proof image not found.",
              );
          }

          await this.notificationService.orderFinishedImage({
              phone: order.user_id.phone_number,
              customer_name: order.user_id.name,
              order_number: order.orderNumber,
              product_name: order.order_item[0].product_id.name,
              store_name: order.order_item[0].store_id.name,
              image_url: "https://storage.ahmadfahmyga.my.id/flowera"+latestImage.image_url,
              order_url: `https://flowera.my.id /profile/orders/${order.orderNumber}`,
          });

          updateData.status = "CONFIRM_USER";
      }

        break;

    }

    await this.orderRepository.update(id, updateData);

    return {
      status: "success",
      message: `Order status updated from ${order.status} to ${dto.status}`,
    };
  }

  // ─────────────────────────────────────
  // Upload Order Image (proof of work)
  // ─────────────────────────────────────
  async uploadOrderImage(orderId: string, file: Express.Multer.File, note?: string) {
    const id = Number(orderId);
    if (isNaN(id)) throw new BadRequestException('Invalid order ID');

    const order = await this.orderRepository.findOne({ where: { id }, relations: ['user_id'] });
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

    return { status: 'success', message: 'Proof image uploaded, waiting for user confirmation', data: { image_url: uploadResult.path } };
  }
}
