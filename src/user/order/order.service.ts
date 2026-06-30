import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { User } from 'src/database/entities/user.entity';
import { Order } from 'src/database/entities/order.entity';
import { OrderItem } from 'src/database/entities/order-item.entity';
import { Product } from 'src/database/entities/product.entity';
import { ProductVariant } from 'src/database/entities/product-variant.entity';
import { Store } from 'src/database/entities/store.entity';
import { PaymentOrder } from 'src/database/entities/payment-order.entity';
import { OrderImageConfirmed } from 'src/database/entities/order-image-confirmed.entity';
import { Address } from 'src/database/entities/address.entity';

import { RepositoryHelper } from 'src/common/helpers/repository.helper';
import { ShippingCostResponse, ShippingService } from 'src/shipping/shipping.service';
import { CheckoutDto, CheckoutPreviewDto, ConfirmImageDto, ShippingOptionStoreDto } from './order.dto';
import { PaymentService } from 'src/payment/payment.service';

interface ShippingOptionStore {
    store_id: number;
    weight: number;
    shipping: ShippingCostResponse[];
}

@Injectable()
export class OrderService {
  private readonly SERVICE_FEE = 1000;
  constructor(
    private readonly repositoryHelper: RepositoryHelper,
    private readonly shippingService: ShippingService,
    private readonly paymentService: PaymentService,
     private readonly dataSource: DataSource,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductVariant)
    private readonly productVariantRepository: Repository<ProductVariant>,

    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,

    @InjectRepository(PaymentOrder)
    private readonly paymentOrderRepository: Repository<PaymentOrder>,

    @InjectRepository(OrderImageConfirmed)
    private readonly imageRepository: Repository<OrderImageConfirmed>,

    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  // ─────────────────────────────────────
  // PRIVATE: Resolve origin from store
  // ─────────────────────────────────────
  private async resolveOrigin(storeId: number) {
    const store = await this.storeRepository.findOne({ where: { id: storeId } });
    if (!store) throw new NotFoundException(`Store ID ${storeId} not found`);

    if (!store.zip_code) {
      throw new BadRequestException(
        `Store ID ${storeId} has no zip_code — please update your store with regional data`,
      );
    }

    return store.zip_code;
  }

  // ─────────────────────────────────────
  // PRIVATE: Resolve address → destination + shippingAddress
  // ─────────────────────────────────────
  private async resolveAddress(addressId: number) {
    const addr = await this.addressRepository.findOne({ where: { id: addressId } });
    if (!addr) throw new NotFoundException(`Address ID ${addressId} not found`);

    if (!addr.zip_code) {
      throw new BadRequestException(
        'Address has no zip_code. Please update your address with regional data including zip_code.',
      );
    }

    const shippingAddress = [
      addr.nama_penerima, addr.no_hp, addr.address,
      addr.subdistrict_name, addr.district_name, addr.city_name, addr.province_name, addr.zip_code,
    ].filter(Boolean).join(', ');

    return {
      destination: addr.zip_code,
      shippingAddress,
    };
  }

  // ─────────────────────────────────────
  // PRIVATE: Calculate shipping per store via RajaOngkir
  // ─────────────────────────────────────
  private async calculateShipping(
    origin: string,
    destination: string,
    weight: number,
  ) {
    return this.shippingService.calculateCost(
      origin,
      destination,
      weight,
      "jne:sicepat:ide:sap:jnt:ninja:tiki:lion:anteraja:pos:ncs:rex:rpx:sentral:star:wahana:dse",
      "lowest",
    );
  }

  // ─────────────────────────────────────
  // PRIVATE: Group items by store & calculate shipping per store
  // ─────────────────────────────────────
  
  private async calculateShippingOptionsByStore(
    items: { store_id: number; weight_gram: number }[],
    destination: string,
  ): Promise<ShippingOptionStoreDto[]> {

    const storeMap = new Map<number, number>();

    for (const item of items) {
      storeMap.set(
        item.store_id,
        (storeMap.get(item.store_id) ?? 0) + (item.weight_gram ?? 1000),
      );
    }

    const result: ShippingOptionStore[] = [];

    for (const [storeId, weight] of storeMap) {

      const origin = await this.resolveOrigin(storeId);

      const options = await this.calculateShipping(
        origin,
        destination,
        weight,
      );

      result.push({
        store_id: storeId,
        weight,
        shipping: options,
      });
    }

    return result;
  }

  async shippingOptions(dto: CheckoutPreviewDto) {

    const { destination } =
        await this.resolveAddress(dto.address_id);

    const { computedItems } =
        await this.calculateItems(dto.order_items);

    return this.calculateShippingOptionsByStore(
        computedItems.map(item => ({
            store_id: item.store_id,
            weight_gram: item.weight_gram ?? 1000,
        })),
        destination,
    );
}

  // ─────────────────────────────────────
  // CHECKOUT PREVIEW (no save, just calculate & show breakdown)
  // ─────────────────────────────────────
  async checkoutPreview(dto: CheckoutPreviewDto) {
    try {
      if (!dto.order_items?.length) {
        throw new BadRequestException('Order must contain at least one item');
      }

      const { destination, shippingAddress } = await this.resolveAddress(dto.address_id);

      const { computedItems, itemsTotal } = await this.calculateItems(dto.order_items);

      const serviceFee = this.SERVICE_FEE;

      // Calculate shipping per store
      // const shippingTotal = dto.shipping.reduce(
      //     (sum, item) => sum + item.shipping_cost,
      //     0,
      // );

      // const total =
      //     itemsTotal +
      //     shippingTotal -
      //     (dto.discount ?? 0);

      const shippingOptions =
        await this.calculateShippingOptionsByStore(
            computedItems.map(item => ({
                store_id: item.store_id,
                weight_gram: item.product.weight ?? 1000,
            })),
            destination,
        );

      // return {
      //   status: 'success',
      //   message: 'Checkout preview — please review before placing order',
      //   data: {
      //     items: computedItems.map((ci) => {
      //       const ship =
      //         dto.shipping.find(
      //             s => s.store_id === ci.store_id,
      //         );
      //       return {
      //         product_id: ci.product_id,
      //         product_name: ci.product.name,
      //         product_price: ci.product.price,
      //         product_variant_id: ci.product_variant_id ?? null,
      //         variant_title: ci.variant?.title ?? null,
      //         variant_price: ci.variantPrice,
      //         addon_product: ci.addon_product ?? null,
      //         addon_total: ci.addonTotal,
      //         quantity: ci.quantity,
      //         weight_gram: ci.weight_gram ?? 1000,
      //         unit_price: ci.unitPrice,
      //         sub_total: ci.subTotal,
      //         shipping_cost: ship?.shipping_cost ?? 0,
      //         store_id: ci.store_id,
      //       };
      //     }),
      //     shipping_breakdown: dto.shipping,
      //     summary: {
      //       items_total: itemsTotal,
      //       shipping_total: shippingTotal,
      //       discount: dto.discount ?? 0,
      //       grand_total: total,
      //       courier: dto.courier,
      //       destination,
      //       shipping_address: shippingAddress,
      //     },
      //   },
      // };
      return {
          status: "success",
          data: {
              items: computedItems,

              shipping_options: shippingOptions,

              summary: {
                  items_total: itemsTotal,
                  service_fee: serviceFee,
                  discount: dto.discount ?? 0,
                  estimated_total:
                    itemsTotal +
                    serviceFee -
                    (dto.discount ?? 0)
              }
          }
      }
    } catch (error) {
      throw error;
    }
  }

  // ─────────────────────────────────────
  // CHECKOUT (save to DB)
  // ─────────────────────────────────────
  async checkout(userId: number, dto: CheckoutDto) {
    try {
      // ===========================
    // VALIDASI USER
    // ===========================

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!dto.order_items.length) {
      throw new BadRequestException(
        'Order must contain at least one item',
      );
    }

    // ===========================
    // ADDRESS
    // ===========================

    await this.resolveAddress(dto.address_id);

    // ===========================
    // HITUNG ITEM
    // ===========================

    const { computedItems, itemsTotal } =
      await this.calculateItems(dto.order_items);

    // ===========================
    // SHIPPING
    // ===========================

    const shippingTotal = dto.shipping.reduce(
      (sum, item) => sum + item.shipping_cost,
      0,
    );

    const address = await this.addressRepository.findOne({
      where: {
          id: dto.address_id,
      },
    });

    const serviceFee = this.SERVICE_FEE;
    console.log({
        itemsTotal,
        shippingTotal,
        serviceFee,
        discount: dto.discount ?? 0,
    });
    
  if (!address) {
  throw new NotFoundException("Address not found");
  }
    const total =
      itemsTotal +
      shippingTotal +
      serviceFee -
      (dto.discount ?? 0);

    // ===========================
    // ORDER NUMBER
    // ===========================

    const now = new Date();

    const orderNumber =
      `FLW-${now.getFullYear()}${String(
        now.getMonth() + 1,
      ).padStart(2, '0')}${String(
        now.getDate(),
      ).padStart(2, '0')}-${Math.random()
        .toString(36)
        .substring(2, 7)
        .toUpperCase()}`;

      return await this.dataSource.transaction(async (manager) => {
        const order = manager.create(Order, {
          user_id: user,
          orderNumber,
          status: 'UNPAID',
          discount: dto.discount ?? 0,
          items_total: itemsTotal,
          shipping_total: shippingTotal,
          total,
          note: dto.note,
          isCustomerConfirmed: 'NOT_CONFIRMED',
          address: address
        });

        await manager.save(order);

        for (const ci of computedItems) {

            const ship = dto.shipping.find(
                s => s.store_id === ci.store_id,
            );

            const orderItem = manager.create(OrderItem, {

                order_id: order,

                product_id: { id: ci.product_id },

                product_variant_id:
                    ci.product_variant_id
                        ? { id: ci.product_variant_id }
                        : undefined,

                store_id: { id: ci.store_id },

                quantity: ci.quantity,

                price: ci.unitPrice,

                subTotal: ci.subTotal,

                discount: 0,

                courier_name: ship?.courier_name,

                courier_service: ship?.courier_service,

                shipping_cost: ship?.shipping_cost,

                shipping_etd: ship?.shipping_etd,

                addon_product: ci.addon_product,

            });

            await manager.save(orderItem);

        }

        const payment = manager.create(PaymentOrder, {

          order_id: order,

          payment_method: "QRIS",

          payment_status: "PENDING",

          total_price: total,

      });

      // await manager.save(payment);
      const itemDetails = computedItems.map(item => ({
          id: item.product.id.toString(),
          name: item.product.name,
          quantity: item.quantity,
          price: item.unitPrice,
      }));

      itemDetails.push({
          id: "SHIPPING",
          name: "Shipping Cost",
          quantity: 1,
          price: shippingTotal,
      });

      if ((dto.discount ?? 0) > 0) {
        itemDetails.push({
            id: "DISCOUNT",
            name: "Discount",
            quantity: 1,
            price: -(dto.discount ?? 0),
        });
      }

      itemDetails.push({
          id: "SERVICE_FEE",
          name: "Service Fee",
          quantity: 1,
          price: serviceFee,
      });

      const grossAmount = itemDetails.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
      );

      console.log({
          total,
          grossAmount,
      });

      const midtrans =
        await this.paymentService.createQRIS({

            order_id: order.orderNumber,

            gross_amount: total,

            customer_name: user.name,

            customer_email: user.email,

            customer_phone: user.phone_number || "0",

            items: itemDetails,

        });

        payment.transaction_id =
            midtrans.transaction_id;

        payment.reference_id = order.orderNumber;

        payment.status =
            midtrans.transaction_status;

        payment.qr_string =
            midtrans.qr_string;

        const qrAction =
          midtrans.actions?.find(x => x.name === "generate-qr-code-v2") ??
          midtrans.actions?.find(x => x.name === "generate-qr-code");

        payment.payment_url = qrAction?.url;

        payment.expired_payment_time =
            new Date(midtrans.expiry_time);

        payment.payment_response =
            JSON.stringify(midtrans);

        await manager.save(payment);

        return {

            status: "success",

            message: "Checkout success",

            data: {

                order_id: order.id,

                order_number: order.orderNumber,

                payment: {

                    transaction_id:
                        payment.transaction_id,

                    status:
                        payment.status,

                    qr_url:
                        payment.payment_url,

                    qr_string:
                        payment.qr_string,

                    expired_at:
                        payment.expired_payment_time,

                },

                summary: {

                    items_total: itemsTotal,

                    shipping_total: shippingTotal,

                    discount: dto.discount ?? 0,

                    total,

                },

            },

        };
      })
    } catch (error) {
      throw error;
    }
  }

  // ─────────────────────────────────────
  // PRIVATE: Calculate items (shared logic)
  // ─────────────────────────────────────
  private async calculateItems(
    items: { product_id: number; product_variant_id?: number; quantity: number; addon_product?: string; store_id: number; weight_gram?: number }[],
  ) {
    let itemsTotal = 0;
    const computedItems: {
      product_id: number;
      product: Product;
      product_variant_id?: number;
      variant?: ProductVariant;
      variantPrice: number;
      addonTotal: number;
      quantity: number;
      weight_gram?: number;
      addon_product?: string;
      unitPrice: number;
      subTotal: number;
      store_id: number;
    }[] = [];

    for (const item of items) {
      const product = await this.productRepository.findOne({
        where: { id: item.product_id },
        relations: ['store'],
      });
      if (!product) throw new NotFoundException(`Product ID ${item.product_id} not found`);
      if (product.store.id !== item.store_id) {
        throw new BadRequestException(`Product ID ${item.product_id} does not belong to Store ID ${item.store_id}`);
      }

      let variantPrice = 0;
      let variant: ProductVariant | undefined;
      let productVariantId: number | undefined;

      if (item.product_variant_id) {
        const v = await this.productVariantRepository.findOne({
          where: { id: item.product_variant_id },
          relations: ['product'],
        });
        if (!v) throw new NotFoundException(`Variant ID ${item.product_variant_id} not found`);
        if (v.product.id !== item.product_id) {
          throw new BadRequestException(`Variant ID ${item.product_variant_id} does not belong to Product ID ${item.product_id}`);
        }
        variantPrice = v.price;
        variant = v;
        productVariantId = v.id;
      }

      let addonTotal = 0;
      if (item.addon_product) {
        try {
          const addons = JSON.parse(item.addon_product);
          if (Array.isArray(addons)) {
            for (const a of addons) addonTotal += Number(a.price) || 0;
          }
        } catch {
          throw new BadRequestException('Invalid addon_product JSON format');
        }
      }

      const unitPrice = product.price + variantPrice + addonTotal;
      const subTotal = unitPrice * item.quantity;
      itemsTotal += subTotal;

      computedItems.push({
        product_id: product.id,
        product,
        product_variant_id: productVariantId,
        variant,
        variantPrice,
        addonTotal,
        quantity: item.quantity,
        addon_product: item.addon_product,
        unitPrice,
        subTotal,
        store_id: item.store_id,
      });
    }

    return { computedItems, itemsTotal };
  }

  // ─────────────────────────────────────
  // Get All Orders for User
  // ─────────────────────────────────────
  async findAllByUser(userId: number) {
    const orders = await this.orderRepository.find({
      where: { user_id: { id: userId } },
      relations: ['order_item', 'order_item.product_id', 'order_item.product_id.product_image', 'order_item.product_variant_id', 'order_item.store_id', 'order_image_confirmed'],
      order: { createdAt: 'DESC' },
    });
    return { status: 'success', data: orders };
  }

  // ─────────────────────────────────────
  // Get Order Detail (user scope)
  // ─────────────────────────────────────
  async findOneByUser(userId: number, orderId: string) {
    const id = Number(orderId);
    if (isNaN(id)) throw new BadRequestException('Invalid order ID');

    const order = await this.orderRepository.findOne({
      where: { id, user_id: { id: userId } },
      relations: ['order_item', 'order_item.product_id', 'order_item.product_id.product_image', 'order_item.product_variant_id', 'order_item.store_id', 'order_image_confirmed'],
    });
    if (!order) throw new NotFoundException('Order not found');
    return { status: 'success', data: order };
  }

  // ─────────────────────────────────────
  // Confirm / Reject Order Image (user)
  // ─────────────────────────────────────
  async confirmImage(userId: number, imageId: string, dto: ConfirmImageDto) {
    const id = Number(imageId);
    if (isNaN(id)) throw new BadRequestException('Invalid image ID');

    const image = await this.imageRepository.findOne({
      where: { id },
      relations: ['order_id', 'order_id.user_id'],
    });
    if (!image) throw new NotFoundException('Order image not found');
    if (image.order_id.user_id.id !== userId) {
      throw new BadRequestException('This image does not belong to your order');
    }
    if (image.status !== 'PENDING') {
      throw new BadRequestException('This image has already been processed');
    }

    image.status = dto.status;
    image.reply_note = dto.reply_note ?? undefined;
    await this.imageRepository.save(image);

    const newStatus = dto.status === 'CONFIRMED' ? 'DELIVERY' : 'PROSES_PENGERJAAN';
    await this.orderRepository.update(image.order_id.id, { status: newStatus });

    return {
      status: 'success',
      message: dto.status === 'CONFIRMED'
        ? 'Order confirmed, ready for delivery'
        : 'Order rejected, seller will revise',
    };
  }

  // ─────────────────────────────────────
  // Confirm Received (buyer confirms delivery)
  // ─────────────────────────────────────
  async confirmReceived(userId: number, orderId: string) {
    const id = Number(orderId);
    if (isNaN(id)) throw new BadRequestException('Invalid order ID');

    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user_id'],
    });
    if (!order) throw new NotFoundException('Order not found');
    if (order.user_id.id !== userId) {
      throw new BadRequestException('This order does not belong to you');
    }
    if (order.status !== 'DELIVERY') {
      throw new BadRequestException(`Can only confirm receipt when status is DELIVERY. Current: ${order.status}`);
    }

    await this.orderRepository.update(id, { status: 'DITERIMA' });
    return { status: 'success', message: 'Pesanan telah diterima' };
  }
}
