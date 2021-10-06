import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCustomerDto, UpdateCustomerDto } from '../dtos/customers.dto';
import { Customer } from '../entities/customer.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async findMany() {
    return await this.customerRepository.find();
  }

  async findById(id: number) {
    const customer = await this.customerRepository.findOne(id);

    if (!customer)
      throw new NotFoundException(`Customer with id ${id} not found`);

    return customer;
  }

  async create(payload: CreateCustomerDto) {
    const newCustomer = this.customerRepository.create(payload);

    return await this.customerRepository.save(newCustomer);
  }

  async update(id: number, payload: UpdateCustomerDto) {
    const customer = await this.findById(id);

    this.customerRepository.merge(customer, payload);

    return await this.customerRepository.save(customer);
  }

  async remove(id: number) {
    const customer = await this.findById(id);

    await this.customerRepository.delete(id);

    return customer;
  }
}
