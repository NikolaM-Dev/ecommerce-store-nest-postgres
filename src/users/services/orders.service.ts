import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateOrderDto, UpdateOrderDto } from '../dtos/orders.dto';
import { Customer } from '../entities/customer.entity';
import { Order } from '../entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(Order) private orderRepository: Repository<Order>,
  ) {}

  findMany() {
    return this.orderRepository.find({ relations: ['customer'] });
  }

  async findById(id: number) {
    const order = await this.orderRepository.findOne(id, {
      relations: ['customer', 'items', 'items.product'],
    });

    if (!order)
      throw new NotFoundException(`Order with id ${id} not found in database`);

    return order;
  }

  async findManyByCustomer(customerId: number): Promise<Order[]> {
    return await this.orderRepository.find({
      where: { customer: customerId },
      relations: ['customer'],
    });
  }

  async create(payload: CreateOrderDto) {
    const newOrder = new Order();

    if (payload.customerId) {
      const customer = await this.customerRepository.findOne(
        payload.customerId,
      );

      newOrder.customer = customer;
    }

    return this.orderRepository.save(newOrder);
  }

  async update(id: number, payload: UpdateOrderDto) {
    const order = await this.orderRepository.findOne(id);

    if (payload.customerId) {
      const customer = await this.customerRepository.findOne(
        payload.customerId,
      );

      if (!customer)
        throw new NotFoundException(
          `Customer with id ${payload.customerId} not found`,
        );

      order.customer = customer;
    }

    return this.orderRepository.save(order);
  }

  async remove(id: number) {
    const order = await this.findById(id);

    await this.orderRepository.delete(id);

    return order;
  }
}
