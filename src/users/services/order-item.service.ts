import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateOrderItemDto, UpdateOrderItemDto } from '../dtos/order-item.dto';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-product.entity';
import { Product } from '../../products/entities/product.entity';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly itemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findMany() {
    return await this.itemRepository.find();
  }

  async findById(id: number) {
    return await this.itemRepository.findOne(id, {
      relations: ['product', 'order'],
    });
  }

  async create(payload: CreateOrderItemDto) {
    const order = await this.orderRepository.findOne(payload.orderId);
    const product = await this.productRepository.findOne(payload.productId);
    const item = this.itemRepository.create({
      order,
      product,
      quantity: payload.quantity,
    });

    return await this.itemRepository.save(item);
  }

  async update(id: number, payload: UpdateOrderItemDto) {
    const item = await this.itemRepository.findOne(id);

    if (!item) throw new NotFoundException(`Item with id ${id} not found`);

    if (payload.orderId) {
      const order = await this.orderRepository.findOne(payload.orderId);

      item.order = order;
    }
    if (payload.productId) {
      const product = await this.productRepository.findOne(payload.productId);

      item.product = product;
    }
    if (payload.quantity) {
      item.quantity = payload.quantity;
    }

    return await this.itemRepository.save(item);
  }

  async remove(id: number) {
    const item = await this.findById(id);

    await this.itemRepository.delete(id);

    return item;
  }
}
