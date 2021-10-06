import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductsService } from 'src/products/services/products.service';

import { CreateUserDto, UpdateUserDto } from '../dtos/users.dto';
import { User } from '../entities/user.entity';

import { CustomersService } from './customers.service';

@Injectable()
export class UsersService {
  constructor(
    private productsService: ProductsService,
    private readonly customersService: CustomersService,
    @InjectRepository(User) private readonly userReposity: Repository<User>,
  ) {}

  async findMany() {
    return await this.userReposity.find({
      relations: ['customer'],
    });
  }

  async findById(id: number) {
    const user = await this.userReposity.findOne(id, {
      relations: ['customer'],
    });

    if (!user)
      throw new NotFoundException(`User with id ${id} not found in database`);

    return user;
  }

  async create(payload: CreateUserDto) {
    const newUser = this.userReposity.create(payload);

    if (payload.customerId) {
      const customer = await this.customersService.findById(payload.customerId);

      newUser.customer = customer;
    }

    return await this.userReposity.save(newUser);
  }

  async update(id: number, payload: UpdateUserDto) {
    const user = await this.findById(id);

    this.userReposity.merge(user, payload);

    return await this.userReposity.save(user);
  }

  async remove(id: number) {
    const user = await this.findById(id);

    await this.userReposity.delete(id);

    return user;
  }

  async findOrderByUser(id: number) {
    const user = await this.findById(id);

    return {
      date: new Date(),
      user,
      products: await this.productsService.findMany(),
    };
  }
}
